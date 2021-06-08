import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerCharge } from '../../../entities/MarketerCharge';
import { MarketerRefund } from '../../../entities/MarketerRefund';
import { CampaignLogRepository } from '../../../repositories/CampaignLog.repository';
import { ChargeHistoryResObj } from './interfaces/chargeHistoryRes.interface';
import { FindRefundHistoryResObj } from './interfaces/findRefundHistoryRes.interface';
import {
  FindUsageHistoryMetadata,
  FindUsageHistoryResWithMetadata,
} from './interfaces/findUsageHistoryRes.interface';

@Injectable()
export class CashHistoryService {
  constructor(
    @InjectRepository(MarketerCharge)
    private readonly marketerChargeRepo: Repository<MarketerCharge>,
    @InjectRepository(MarketerRefund)
    private readonly marketerRefundRepo: Repository<MarketerRefund>,
    @InjectRepository(CampaignLogRepository)
    private readonly campaignLogRepo: CampaignLogRepository,
  ) {}

  // **************************
  // * history 캐시 충전 및 사용 내역
  // **************************

  // * 캐시 충전 내역 테이블 데이터
  async findChargeHistory(marketerId: string): Promise<string[][]> {
    const result = (await this.marketerChargeRepo
      .createQueryBuilder()
      .select('DATE_FORMAT(date, "%y년 %m월 %d일 %T") as date')
      .addSelect('FORMAT(ROUND(cash), 0) as cash, type, temporaryState')
      .where('marketerId = :marketerId', { marketerId })
      .orderBy('date', 'DESC')
      .getRawMany()) as MarketerCharge[];

    const sendArray: string[][] = [];
    result.forEach(queryResult => {
      const object: Partial<ChargeHistoryResObj> = {};
      object.cash = String(queryResult.cash);
      if (queryResult.type === 'vbank') object.type = '가상계좌';
      else if (queryResult.type === 'trans') object.type = '계좌이체';
      else if (queryResult.type === 'card') object.type = '신용카드';
      switch (queryResult.temporaryState) {
        case 1:
          object.temporaryState = '완료됨';
          break;
        case 2:
          object.temporaryState = '취소됨';
          break;
        default:
          object.temporaryState = '진행중';
          break;
      }
      sendArray.push(Object.values(object));
    });
    return sendArray;
  }

  // * 마케터 광고캐시 환불내역 리스트
  async findRefundHistory(marketerId: string): Promise<string[][]> {
    const result: FindRefundHistoryResObj[] = await this.marketerRefundRepo
      .createQueryBuilder('mr')
      .select(`DATE_FORMAT(date, '%y년 %m월 %d일 %T') as date, FORMAT(cash, 0) as cash, mr.check`)
      .where('marketerId = :marketerId', { marketerId })
      .orderBy('date', 'DESC')
      .getRawMany();

    const sendArray = [];
    result.forEach(obj => {
      const object = obj;
      object.check = object.check === 0 ? '진행중' : '완료됨';
      sendArray.push(Object.values(object));
    });

    return sendArray;
  }

  // * 마케터 광고캐시 소진 내역
  async findUsageHistory(marketerId: string): Promise<string[][]> {
    const usageList = await this.campaignLogRepo.findCashUsageFromCampaignLog(marketerId);
    return usageList.map(obj => Object.values(obj));
  }

  // * 마케터 광고캐시 소진 내역
  async findUsageHistoryMohthly(
    marketerId: string,
    targetMonth: string,
  ): Promise<FindUsageHistoryResWithMetadata> {
    const usageList = await this.campaignLogRepo.findCashUsageFromCampaignLog(
      marketerId,
      targetMonth,
    );

    const usageMetaData: FindUsageHistoryMetadata[] = await this.campaignLogRepo
      .createQueryBuilder('cl')
      .select('type, FORMAT(sum(cashFromMarketer), 0) as cash')
      .where(`SUBSTRING_INDEX(cl.campaignId, '_', 1) = :marketerId`, { marketerId })
      .andWhere('DATE_FORMAT(cl.date, "%y년 %m월") = :targetMonth', { targetMonth })
      .andWhere('type != "CPS"')
      .groupBy('DATE_FORMAT(cl.date, "%y년 %m월"), type')
      .orderBy('type', 'DESC')
      .getRawMany();

    const result = {
      data: usageList.map(usage => Object.values(usage)),
      metaData: usageMetaData,
    };
    return result;
  }
}
