import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchandiseOrderComments } from '../../../entities/MerchandiseOrderComments';
import { MerchandiseOrders } from '../../../entities/MerchandiseOrders';
import { MerchandiseRegistered } from '../../../entities/MerchandiseRegistered';
import { Tracking } from '../../../entities/Tracking';
import { CampaignLogRepository } from '../../../repositories/CampaignLog.repository';
import { FindCpsChartDataRes } from './interfaces/findCpsChartDataRes.interface';
import { FindCpsMetaInfoRes } from './interfaces/findCpsMetaInfoRes.interface';
import { FindCpsReviewRes } from './interfaces/findCpsReviewsRes.interface';

@Injectable()
export class CpsService {
  constructor(
    @InjectRepository(CampaignLogRepository)
    private readonly campaignLogRepo: CampaignLogRepository,
    @InjectRepository(MerchandiseOrderComments)
    private readonly merchandiseOrderCommentsRepo: Repository<MerchandiseOrderComments>,
  ) {}

  /**
   * * 특정 방송인의 판매형 광고를 통한 수익금, 판매수량, 클릭 수를 반환합니다.
   * @param creatorId 방송인 고유 아이디
   * @returns { income: 0, salesCount: 0, clickCount: 0 }[]
   */
  public async findCpsMetaInfo(creatorId: string): Promise<FindCpsMetaInfoRes> {
    const result = await this.campaignLogRepo
      .createQueryBuilder('cl')
      .select('SUM(cashToCreator) AS income, COUNT(*) AS salesCount')
      .addSelect(
        qb =>
          qb
            .select('COUNT(*)')
            .from(Tracking, 'tracking')
            .where('creatorId = :creatorId', { creatorId })
            .andWhere('costType = "CPS"'),
        'clickCount',
      )
      .where('creatorId = :creatorId', { creatorId })
      .andWhere('type = "CPS"')
      .getRawOne();
    if (!result) return { income: 0, salesCount: 0, clickCount: 0 };
    return result;
  }

  /**
   * * 특정 방송인의 판매수 그래프 데이터를 반환합니다.
   * @param creatorId 방송인 고유 아이디
   * @param dateRange 검색할 데이터 날짜 수
   * @returns { date: Date, value: number; type: 'CPS'}[]
   */
  public async findCpsChartData(creatorId: string, dateRange = 30): Promise<FindCpsChartDataRes> {
    return this.campaignLogRepo
      .createQueryBuilder('cl')
      .select('DATE_FORMAT(cl.date, "%Y-%m-%d") as date, sum(cashToCreator) as value, type')
      .where('creatorId = :creatorId', { creatorId })
      .andWhere('cl.date >= DATE_SUB(NOW(), INTERVAL :dateRange DAY)', { dateRange })
      .andWhere('type = "CPS"')
      .groupBy('DATE_FORMAT(cl.date, "%Y-%m-%d")')
      .addGroupBy('type')
      .orderBy('cl.date', 'DESC')
      .getRawMany();
  }

  /**
   * * 특정 방송인의 모든 판매 리뷰 목록을 반환합니다.
   * @param creatorId 방송인 고유 아이디
   * @returns merchandiseOrderComments
   */
  public async findCpsReviews(creatorId: string): Promise<FindCpsReviewRes> {
    return this.merchandiseOrderCommentsRepo
      .createQueryBuilder('MOC')
      .select('MOC.*, MO.orderPrice, optionId, quantity, MO.status')
      .addSelect('MR.id AS merchandiseId, MR.name AS merchandiseName, MR.images, MR.marketerId')
      .innerJoin(MerchandiseOrders, 'MO', 'MOC.orderId = MO.id')
      .innerJoin(MerchandiseRegistered, 'MR', 'MR.id = MO.merchandiseId')
      .where('creatorId = :creatorId', { creatorId })
      .orderBy('MOC.createDate', 'DESC')
      .getRawMany();
  }
}
