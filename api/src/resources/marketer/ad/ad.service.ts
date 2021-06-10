import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, QueryBuilder, Repository } from 'typeorm';
import { Campaign } from '../../../entities/Campaign';
import { CampaignLog } from '../../../entities/CampaignLog';
import { MarketerInfo } from '../../../entities/MarketerInfo';
import { Tracking } from '../../../entities/Tracking';
import { FindCashAmountRes } from './interfaces/findCashAmountRes.interface';
import { FindCreatorCountRes } from './interfaces/findCreatorCountRes.interface';
import {
  FindExpenditureCpsRes,
  FindExpenditureCpsResObj,
  FindExpenditureCpsResQueryResult,
} from './interfaces/findExpenditureCpsRes.interface';
import { FindExpenditureRes } from './interfaces/findExpenditureRes.interface';

@Injectable()
export class AdService {
  constructor(
    @InjectRepository(MarketerInfo) private readonly marketerInfoRepo: Repository<MarketerInfo>,
    @InjectRepository(CampaignLog) private readonly campaignLogRepo: Repository<CampaignLog>,
    @InjectRepository(Tracking) private readonly trackingRepo: Repository<Tracking>,
  ) {}

  // * 대시보드 - 마케터의 보유 캐시량, 총 소진 비용
  async findCashAmount(marketerId: string): Promise<FindCashAmountRes> {
    const query = `SELECT cashAmount, spendAll FROM
      (
          SELECT cashAmount
          FROM marketerDebit
          WHERE marketerId = ?) AS cashAmount,
      (
          SELECT IFNULL(sum(cashFromMarketer), 0) AS spendAll
          FROM campaignLog
          WHERE SUBSTRING_INDEX(campaignId, "_" , 1) = ?) AS spendAll`;

    const conn = getConnection();
    const result = await conn.query(query, [marketerId, marketerId]);
    if (result.length > 0) return result[0];
    return { cashAmount: 0, spendAll: 0 };
  }

  // * 광고주 ONOFF 상태 조회
  async findOnOffState(marketerId: string): Promise<boolean> {
    const { marketerContraction } = await this.marketerInfoRepo.findOne({
      where: { marketerId },
      select: ['marketerContraction'],
    });
    return !!marketerContraction;
  }

  // * 광고주 ONOFF 상태 변경
  async changeOnOffState(marketerId: string, onOffState: boolean): Promise<boolean> {
    const result = await this.marketerInfoRepo
      .createQueryBuilder()
      .update()
      .set({ marketerContraction: onOffState ? 1 : 0 })
      .where('marketerId = :marketerId', { marketerId })
      .execute();
    if (result.affected > 0) return true;
    return false;
  }

  // * 마케터 대시보드의 비용에 대한 차트 데이터 제공
  async findExpenditure(marketerId: string): Promise<FindExpenditureRes> {
    const result = await this.campaignLogRepo
      .createQueryBuilder('cl')
      .select('DATE_FORMAT(max(cl.date), "%Y-%m-%d") as date')
      .addSelect('IFNULL(sum(cashFromMarketer), 0) as value')
      .addSelect('type')
      .where("SUBSTRING_INDEX(cl.campaignId, '_', 1) = :marketerId", { marketerId })
      .andWhere('cl.date >= DATE_SUB(NOW(), INTERVAL 30 DAY)')
      .groupBy('DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type')
      .orderBy('cl.date', 'DESC')
      .getRawMany();

    return result;
  }

  // * 마케터 대시보드의 판매에 대한 차트 데이터 제공
  // * 마케터의 CPS 캠페인들의 클릭, CPS 판매
  async findExpenditureCps(marketerId: string): Promise<FindExpenditureCpsRes> {
    const clicks = await this.getMonthlyClicks(marketerId);
    const soldCounts = await this.getMonthlySoldCounts(marketerId);

    const dataArray: FindExpenditureCpsResObj[] = [];
    clicks.forEach(value => {
      const obj: FindExpenditureCpsResObj = { date: value.date, value: value.amount, type: '클릭' };
      dataArray.push(obj);
    });
    soldCounts.forEach(value => {
      const obj: FindExpenditureCpsResObj = { date: value.date, value: value.amount, type: '판매' };
      dataArray.push(obj);
    });
    return dataArray.sort((x, y) => x.date.localeCompare(y.date));
  }

  // * 마케터 대시보드의 크리에이터 수, 현재 광고주가 광고 송출한 크리에이터 수
  async findCreatorCount(marketerId: string): Promise<FindCreatorCountRes> {
    return this.campaignLogRepo
      .createQueryBuilder('CL')
      .select('COUNT( DISTINCT creatorId ) AS counts')
      .innerJoin(
        (qb): QueryBuilder<Campaign> =>
          qb
            .select('campaignId')
            .from(Campaign, 'campaign')
            .where('marketerId = :marketerId', { marketerId }),
        'CP',
        'CL.campaignId = CP.campaignId',
      )
      .getRawOne();
  }

  // *******************************
  // * Private Methods
  // *******************************

  // * 월간, 일별 CPS "클릭수" 조회
  private getMonthlyClicks(marketerId: string): Promise<FindExpenditureCpsResQueryResult[]> {
    return this.trackingRepo
      .createQueryBuilder()
      .select('DATE_FORMAT(max(createdAt), "%Y-%m-%d") AS date')
      .addSelect('COUNT(*) AS amount')
      .where('marketerId = :marketerId', { marketerId })
      .andWhere('os IS NOT NULL')
      .andWhere('costType = :costType', { costType: 'CPS' })
      .andWhere('DATE_SUB(createdAt, INTERVAL 1 MONTH)')
      .groupBy('DATE_FORMAT(createdAt, "%y년 %m월 %d일")')
      .orderBy('createdAt', 'ASC')
      .getRawMany();
  }

  // * 월간, 일별 CPS "판매량" 조회
  private getMonthlySoldCounts(marketerId: string): Promise<FindExpenditureCpsResQueryResult[]> {
    return this.campaignLogRepo
      .createQueryBuilder()
      .select('DATE_FORMAT(max(date), "%Y-%m-%d") AS date')
      .addSelect('COUNT(*) AS amount')
      .where("SUBSTRING_INDEX(campaignId, '_', 1) = :marketerId", { marketerId })
      .andWhere('type = :type', { type: 'CPS' })
      .groupBy('DATE_FORMAT(date, "%y년 %m월 %d일")')
      .orderBy('date', 'ASC')
      .getRawMany();
  }
}
