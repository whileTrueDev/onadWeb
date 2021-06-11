import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { MerchandiseMallItems } from '../../../entities/MerchandiseMallItems';
import { MerchandiseOptions } from '../../../entities/MerchandiseOptions';
import { MerchandiseOrderRelease } from '../../../entities/MerchandiseOrderRelease';
import { MerchandiseOrders } from '../../../entities/MerchandiseOrders';
import { MerchandiseOrderStatuses } from '../../../entities/MerchandiseOrderStatuses';
import { MerchandiseRegistered } from '../../../entities/MerchandiseRegistered';
import { transactionQuery } from '../../../utils/transactionQuery';
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
    @InjectRepository(MerchandiseOrders)
    private readonly orderRepo: Repository<MerchandiseOrders>,
    @InjectRepository(MerchandiseRegistered)
    private readonly merchandiseRepo: Repository<MerchandiseRegistered>,
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
    const qb = this.orderRepo
      .createQueryBuilder('mo')
      .select('mo.id, mo.merchandiseId, campaignId, optionId, status, statusString, orderPrice')
      .addSelect('ordererName, recipientName, quantity, mo.createDate, mo.updateDate')
      .addSelect('mo.denialReason, deliveryMemo, email, jibunAddress, roadAddress, mo.denialReason')
      .addSelect('zoneCode, phone, mr.name, mr.price, stock, optionFlag, mopt.type as optionType')
      .addSelect('mopt.name as optionValue, mopt.additionalPrice')
      .addSelect('mm.soldCount AS merchandiseSoldCount, mor.id AS releaseId, courierCompany')
      .addSelect('trackingNumber')
      .innerJoin(MerchandiseRegistered, 'mr', 'mr.id =  mo.merchandiseId')
      .innerJoin(MerchandiseOrderStatuses, 'mos', 'mo.status = mos.statusNumber')
      .leftJoin(MerchandiseOptions, 'mopt', 'mo.optionId = mopt.id')
      .leftJoin(MerchandiseMallItems, 'mm', 'mr.id = mm.merchandiseId')
      .leftJoin(MerchandiseOrderRelease, 'mor', 'mo.id = mor.orderId');
    if (merchandiseId) {
      return qb
        .where('mo.merchandiseId = :merchandiseId', { merchandiseId })
        .orderBy('mo.createDate', 'DESC')
        .getRawMany();
    }
    if (campaignId) {
      return qb
        .where('campaignId = :campaignId', { campaignId })
        .orderBy('mo.createDate', 'DESC')
        .getRawMany();
    }
    if (marketerId) {
      return qb
        .where('marketerId = :marketerId', { marketerId })
        .orderBy('mo.createDate', 'DESC')
        .getRawMany();
    }
    return null;
  }

  async updateOrder(marketerId: string, dto: UpdateOrderDto): Promise<boolean> {
    const conn = getConnection();

    const order: OrderData = await this.merchandiseRepo
      .createQueryBuilder('merchandiseRegistered')
      .select('marketerId, quantity, merchandiseRegistered.id AS merchandiseId')
      .addSelect('mor.id AS releaseId, ordererName, merchandiseRegistered.name AS merchandiseName')
      .innerJoin(
        MerchandiseOrders,
        'merchandiseOrders',
        'merchandiseRegistered.id = merchandiseOrders.merchandiseId',
      )
      .leftJoin(MerchandiseOrderRelease, 'mor', 'mor.orderId = merchandiseOrders.id')
      .where('merchandiseOrders.id = :orderId', { orderId: dto.orderId })
      .getRawOne();
    if (!order) throw new BadRequestException(`requested order - ${dto.orderId} is not exists`);
    if (!(order.marketerId === marketerId)) throw new UnauthorizedException();

    return transactionQuery(
      conn,
      async queryRunner => {
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
            await queryRunner.manager.save(MerchandiseOrderRelease, newRelease);
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
            .createQueryBuilder('mmi', queryRunner)
            .update()
            .set({ soldCount: () => `soldCount - ${order.quantity}` })
            .where('merchandiseId = :merchandiseId', { merchandiseId: order.merchandiseId })
            .execute();
        }

        if (result.affected > 0) return true;
        return false;
      },
      { errorMessage: 'orders.service -> updateOrder - ' },
    );
  }
}
