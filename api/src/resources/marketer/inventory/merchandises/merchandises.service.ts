import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { PaginationDto } from '../../../../dto/paginationDto.dto';
import { Campaign } from '../../../../entities/Campaign';
import { MerchandiseMallItems } from '../../../../entities/MerchandiseMallItems';
import { MerchandiseOptions } from '../../../../entities/MerchandiseOptions';
import { MerchandisePaymentMethods } from '../../../../entities/MerchandisePaymentMethods';
import { MerchandisePickupAddresses } from '../../../../entities/MerchandisePickupAddresses';
import { MerchandiseRegistered } from '../../../../entities/MerchandiseRegistered';
import { transactionQuery } from '../../../../utils/transactionQuery';
import { CreateMerchandiseDto } from './dto/createMerchandiseDto.dto';
import {
  FindMerchandiseDetail,
  FindMerchandiseRes,
} from './interfaces/findMerchandiseRes.interface';

@Injectable()
export class MerchandisesService {
  constructor(
    @InjectRepository(MerchandiseRegistered)
    private readonly merchandiseRepo: Repository<MerchandiseRegistered>,
    @InjectRepository(MerchandiseOptions)
    private readonly merchandiseOptionRepo: Repository<MerchandiseOptions>,
    @InjectRepository(MerchandisePickupAddresses)
    private readonly merchandisePickupAddressRepo: Repository<MerchandisePickupAddresses>,
    @InjectRepository(Campaign) private readonly campaignRepo: Repository<Campaign>,
    @InjectRepository(MerchandisePaymentMethods)
    private readonly paymentMethodsRepo: Repository<MerchandisePaymentMethods>,
  ) {}

  // * 상품 목록 조회 - 페이지네이션
  async findMerchandisesPaginated(
    marketerId: string,
    dto: PaginationDto,
  ): Promise<FindMerchandiseDetail[]> {
    const searchPage = Math.round(Number(dto.page) * Number(dto.offset));
    const searchOffset = Number(dto.offset);
    const query = `
      SELECT mr.*, mmi.uploadState, denialReason
      FROM merchandiseRegistered AS mr
      LEFT JOIN merchandiseMallItems AS mmi ON mmi.merchandiseId = mr.id
      WHERE marketerId = ?
      ORDER BY createDate DESC                   
      LIMIT ?, ?
    `;
    const result = (await this.merchandiseRepo.query(query, [
      marketerId,
      searchPage,
      searchOffset,
    ])) as FindMerchandiseDetail[];

    return result;
  }

  // * 광고주ID 기준 상품 목록 조회
  findMerchandisesByMarketer(marketerId: string): Promise<MerchandiseRegistered[]> {
    return this.merchandiseRepo.find({ where: { marketerId }, order: { createDate: 'DESC' } });
  }

  // * 캠페인에 연결되지 않은 상품 목록 조회
  public async findNotConnectedMerchandises(marketerId: string): Promise<FindMerchandiseDetail[]> {
    const result = (await this.merchandiseRepo
      .createQueryBuilder('mr')
      .leftJoinAndSelect(Campaign, 'campaign', 'campaign.merchandiseId = mr.id')
      .where('mr.marketerId = :marketerId AND campaignId IS NULL', { marketerId })
      .orderBy('createDate', 'DESC')
      .getMany()) as FindMerchandiseDetail[];
    return result;
  }

  /**
   * * 상품 생성
   * 상품을 생성하는 함수
   * @param marketerId 마케터 고유 아이디
   * @param merchandise 상품 정보
   */
  async createMerchandise(
    marketerId: string,
    dto: CreateMerchandiseDto,
  ): Promise<MerchandiseRegistered> {
    const merchandiseObj = this.merchandiseRepo.create({
      ...dto,
      images: dto.images.join(','),
      descImages: dto.descImages.join(','),
      marketerId,
    });

    if (dto.pickupFlag && dto.pickupAddress) {
      const pickupAddr = await this.merchandisePickupAddressRepo.save({ ...dto.pickupAddress });
      merchandiseObj.pickupId = String(pickupAddr.id);
    }

    const newMerchandise = await this.merchandiseRepo.save(merchandiseObj);

    if (dto.optionFlag && dto.options) {
      const options = dto.options.map(opt => ({ ...opt, merchandiseId: newMerchandise.id }));
      await this.merchandiseOptionRepo.save([...options]);
    }

    return newMerchandise;
  }

  /**
   * * 상품 삭제
   * 특정 상품을 삭제합니다. option이 있다면 option도 함께 삭제합니다.
   * @param marketerId 마케터 고유 아이디
   * @param merchandiseId 삭제할 상품 번호
   * @returns {boolean}
   */
  async deleteMerchandise(
    marketerId: string,
    merchandiseId: MerchandiseRegistered['id'],
  ): Promise<boolean> {
    const merchandise = await this.merchandiseRepo.findOne(merchandiseId);
    const connection = getConnection();
    return transactionQuery(
      connection,
      async queryRunner => {
        if (merchandise.optionFlag) {
          this.merchandiseOptionRepo
            .createQueryBuilder('mro', queryRunner)
            .delete()
            .where('merchandiseId = :merchandiseId', { merchandiseId })
            .execute();
        }
        const result = await this.merchandiseRepo
          .createQueryBuilder('mr', queryRunner)
          .delete()
          .where('marketerId = :marketerId AND id = :merchandiseId', { marketerId, merchandiseId })
          .execute();

        if (result.affected > 0) return true;
        return false;
      },
      { errorMessage: `An error occurred during delete merchandise (id:${merchandiseId}) - ` },
    );
  }

  // * 상품 개수 조회
  /**
   * 상품 개수 정보 반환 함수
   * @param marketerId 마케터 고유 아이디
   */
  findMerchandisesCount(marketerId: string): Promise<number> {
    return this.merchandiseRepo.count({ where: { marketerId } });
  }

  // * 상품 이름 중복 체크
  /**
   * 입력한 상품명과 중복되는 상품이 있는 지 체크합니다. 있으면 true를 없으면 false를 반환합니다.
   * @param merchandiseName 중복 체크할 상품명
   * @returns {boolean}
   */
  async duplicateCheck(merchandiseName: string): Promise<boolean> {
    const count = await this.merchandiseRepo.count({ where: { name: merchandiseName } });
    if (count > 0) return true;
    return false;
  }

  // * 상품과 연결된 캠페인 체크
  findCampaignByMerchandise(marketerId: string, merchandiseId: number): Promise<number> {
    return this.campaignRepo.count({ where: { deletedState: 0, merchandiseId, marketerId } });
  }

  // * 상품 개별 정보 조회
  /**
   * 개별 상품정보를 조회합니다. option과 pickupAddress는 존재하는 경우에만 반환됩니다.
   * @param merchandiseId 상품 ID
   * @returns {FindMerchandisesRes}
   */
  async findMerchandise(merchandiseId: number): Promise<FindMerchandiseRes> {
    const merchandise = (await this.merchandiseRepo
      .createQueryBuilder('mr')
      .leftJoinAndSelect(MerchandiseMallItems, 'mm', 'mr.id = mm.merchandiseId')
      .where('mr.id = :merchandiseId', { merchandiseId })
      .select('mr.*, mm.itemSiteUrl, mm.soldCount, mm.uploadState, mm.denialReason')
      .getRawOne()) as FindMerchandiseDetail;
    if (!merchandise) return null;

    const result: FindMerchandiseRes = merchandise;
    // 옵션이 있는 상품의 경우
    if (merchandise.optionFlag) {
      result.options = await this.merchandiseOptionRepo.find({ where: { merchandiseId } });
    }
    // pickup 주소가 있는 상품의 경우
    if (merchandise.pickupFlag) {
      result.pickupAddress = await this.merchandisePickupAddressRepo.findOne({
        where: { id: merchandise.pickupId },
        order: { createDate: 'DESC' },
      });
    }

    result.imagesRes = merchandise.images.split(',');
    return result;
  }

  // * 광고주 marketer merchandise address 기록을 불러옵니다.
  findMerchandiseAddress(marketerId: string): Promise<MerchandisePickupAddresses[]> {
    return this.merchandisePickupAddressRepo
      .createQueryBuilder()
      .where('id IN (SELECT pickupId FROM merchandiseRegistered WHERE marketerId = :marketerId)', {
        marketerId,
      })
      .orderBy('createDate', 'ASC')
      .take(2)
      .getMany();
  }

  // * 결제 수단과 결제 수단별 수수료 정보
  public findPaymentMethods(): Promise<MerchandisePaymentMethods[]> {
    return this.paymentMethodsRepo.find();
  }

  // *************************************
  // * Private methods
  // *************************************
}
