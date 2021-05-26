import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { MerchandiseMallItems } from '../../../entities/MerchandiseMallItems';
import { MerchandiseOrderRelease } from '../../../entities/MerchandiseOrderRelease';
import { MerchandiseOrders } from '../../../entities/MerchandiseOrders';
import { SlackService } from '../../slack/slack.service';
import { FindOrdersDto } from './dto/findOrdersDto.dto';
import { UpdateOrderDto } from './dto/updateOrderDto.dto';
import { FindOrdersRes } from './interfaces/findOrdersRes.interface';

export interface OrderData {
  marketerId: string;
  quantity: number;
  merchandiseId: number;
  releaseId: number;
  ordererName: string;
  merchandiseName: string;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(MerchandiseOrders) private readonly ordersRepo: Repository<MerchandiseOrders>,
    @InjectRepository(MerchandiseOrderRelease)
    private readonly orderReleaseRepo: Repository<MerchandiseOrderRelease>,
    @InjectRepository(MerchandiseMallItems)
    private readonly merchandiseMallItemsRepo: Repository<MerchandiseMallItems>,
    private readonly slackService: SlackService,
  ) {}

  async findOrders(
    marketerId: string,
    { merchandiseId, campaignId }: FindOrdersDto,
  ): Promise<FindOrdersRes> {
    const query = `SELECT
      mo.id, mo.merchandiseId, campaignId, optionId, status, statusString, orderPrice, ordererName,
      recipientName, quantity, mo.createDate, mo.updateDate, mo.denialReason,
      deliveryMemo, email, jibunAddress, roadAddress, mo.denialReason, zoneCode, phone,
      mr.name, mr.price, stock, optionFlag, mopt.type as optionType, mopt.name as optionValue, mopt.additionalPrice,
      mm.soldCount AS merchandiseSoldCount,
      mor.id AS releaseId, courierCompany, trackingNumber
    FROM merchandiseOrders AS mo
    JOIN merchandiseRegistered AS mr ON mr.id =  mo.merchandiseId
    JOIN merchandiseOrderStatuses AS mos ON mo.status = mos.statusNumber
    LEFT JOIN merchandiseOptions AS mopt ON mo.optionId = mopt.id
    LEFT JOIN merchandiseMallItems AS mm ON mr.id = mm.merchandiseId
    LEFT JOIN merchandiseOrderRelease AS mor ON mo.id = mor.orderId
    `;
    const conn = getConnection();
    if (merchandiseId) {
      const queryCondition = 'WHERE mo.merchandiseId = ? ORDER BY mo.createDate DESC';
      const result = await conn.query(query + queryCondition, [merchandiseId]);
      return result;
    }
    if (campaignId) {
      const queryCondition = 'WHERE campaignId = ? ORDER BY mo.createDate DESC';
      const result = await conn.query(query + queryCondition, [campaignId]);
      return result;
    }
    if (marketerId) {
      const queryCondition = 'WHERE marketerId = ? ORDER BY mo.createDate DESC';
      const result = await conn.query(query + queryCondition, [marketerId]);
      return result;
    }
    return null;
  }

  async updateOrder(marketerId: string, dto: UpdateOrderDto): Promise<boolean> {
    const conn = getConnection();
    const queryRunner = conn.createQueryRunner();
    queryRunner.connect();

    const selectResult = (await queryRunner.query(
      `SELECT
        marketerId, quantity, merchandiseRegistered.id AS merchandiseId,
        mor.id AS releaseId, ordererName, merchandiseRegistered.name AS merchandiseName
      FROM merchandiseRegistered
        JOIN merchandiseOrders ON merchandiseRegistered.id = merchandiseOrders.merchandiseId
        LEFT JOIN merchandiseOrderRelease AS mor ON mor.orderId = merchandiseOrders.id
      WHERE merchandiseOrders.id = ?`,
      [dto.orderId],
    )) as OrderData[];

    if (!selectResult || selectResult.length === 0) throw new UnauthorizedException();

    const order = selectResult[0];
    if (!(order.marketerId === marketerId)) throw new UnauthorizedException();

    try {
      queryRunner.startTransaction();
      // 주문 정보 변경 쿼리
      const result = await queryRunner.manager
        .createQueryBuilder()
        .update(MerchandiseOrders)
        .set({ status: dto.status, denialReason: dto.denialReason })
        .where('id = :id', { id: dto.orderId })
        .execute();

      // '출고완료'(3) 상태로 변경시,
      if (dto.status === 3 && dto.courierCompany && dto.trackingNumber) {
        // 출고정보가 없는 경우.
        if (!order.releaseId) {
          const newRelease = this.orderReleaseRepo.create({
            orderId: dto.orderId,
            courierCompany: dto.courierCompany,
            trackingNumber: dto.trackingNumber,
          });
          await this.orderReleaseRepo.save(newRelease);
        } else {
          // 출고정보를 수정하고자 하는 경우.
          await queryRunner.manager
            .createQueryBuilder()
            .update(MerchandiseOrderRelease)
            .set({ courierCompany: dto.courierCompany, trackingNumber: dto.trackingNumber })
            .where('id = :id', { id: order.releaseId })
            .execute();
        }

        this.slackService.jsonMessage({
          summary: '[온애드 CPS] 상품 출고 완료 알림',
          text:
            '광고주가 주문상품을 출고하였습니다. 온애드샵에서 출고 정보를 입력하고, 출고완료 처리를 진행해주세요.',
          fields: [
            { title: '상품명', value: order.merchandiseName, short: true },
            { title: '주문자', value: order.ordererName, short: true },
            { title: '택배사', value: dto.courierCompany, short: true },
            { title: '송장번호', value: dto.trackingNumber, short: true },
          ],
        });
      }

      // 주문 취소시, 팔린 개수 처리 롤백
      if (dto.status === 5) {
        await this.merchandiseMallItemsRepo
          .createQueryBuilder()
          .update()
          .set({ soldCount: () => `soldCount - ${order.quantity}` })
          .where('merchandiseId = :merchandiseId', { merchandiseId: order.merchandiseId })
          .execute();
      }

      queryRunner.commitTransaction();
      if (result.affected > 0) return true;
      return false;
    } catch (err) {
      console.log('[Error] orders.service -> updateOrder - ', err);
      queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      queryRunner.release();
    }
  }
}
