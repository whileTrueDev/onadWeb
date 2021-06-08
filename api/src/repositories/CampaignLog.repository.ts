import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Campaign } from '../entities/Campaign';
import { CampaignLog } from '../entities/CampaignLog';
import { CreatorDetail } from '../entities/CreatorDetail';
import { CreatorDetailAfreeca } from '../entities/CreatorDetailAfreeca';
import { CreatorInfo } from '../entities/CreatorInfo';
import { FindCpsExpenditureDataObj } from '../resources/marketer/campaign/interfaces/findCpsExpenditureDataRes.interface';
import {
  FindCreatorDataByCampaignRes,
  FindCreatorDataCpsRes,
  FindCreatorDataRes,
} from '../resources/marketer/campaign/interfaces/findCreatorDataRes.interface';
import { FindExpenditureDataRes } from '../resources/marketer/campaign/interfaces/findExpenditureDataRes.interface';
import { FindUsageHistoryResObj } from '../resources/marketer/cash/interfaces/findUsageHistoryRes.interface';

@Injectable()
@EntityRepository(CampaignLog)
export class CampaignLogRepository extends Repository<CampaignLog> {
  // * 마케터 대시보드의 비용에 대한 차트 데이터 제공
  public async findExpenditureData(campaignId: string): Promise<FindExpenditureDataRes[]> {
    const baseQueryBuilder = this.createQueryBuilder('cl')
      .select('cl.date AS date, SUM(cashFromMarketer) AS value, type')
      .where('campaignId = :campaignId AND cl.date > DATE_SUB(cl.date, INTERVAL 30 DAY)', {
        campaignId,
      })
      .groupBy('DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type')
      .orderBy('cl.date', 'ASC');

    return Promise.all([
      baseQueryBuilder.getRawMany(),
      baseQueryBuilder.andWhere('type="CPM"').getRawMany(),
      baseQueryBuilder.andWhere('type="CPC"').getRawMany(),
    ]);
  }

  // * CPS 일별, 월간 판매량 (for CPS캠페인 분석 차트 데이터 제공)
  public async findMonthlyCpsSales(campaignId: string): Promise<FindCpsExpenditureDataObj[]> {
    return this.createQueryBuilder('tracking')
      .select('date AS createdAt, COUNT(*) AS amount')
      .where('campaignId = :campaignId AND type = "CPS"', { campaignId })
      .groupBy('DATE_FORMAT(date, "%y년 %m월 %d일")')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  // * 마케터 캠페인 분석에 사용되는 크리에이터 데이터 -> 마케터별
  public async findCreatorData(marketerId: string): Promise<FindCreatorDataRes> {
    return this.createQueryBuilder('cl')
      .select(
        `ci.creatorId AS id,
        ci.creatorId AS creatorId,
        ci.creatorName AS creatorTwitchName,
        ci.creatorTwitchId AS creatorTwitchId,
        ci.creatorLogo AS creatorLogo, 
        ci.afreecaId,
        ci.afreecaName,
        ci.afreecaLogo,
        SUM(cashFromMarketer) AS total_ad_exposure_amount,
        MAX(cl.date) AS recentDate`,
      )
      .innerJoin(CreatorInfo, 'ci', 'cl.creatorId = ci.creatorId')
      .innerJoin(Campaign, 'campaign', 'cl.campaignId = campaign.campaignId')
      .where('ci.arrested != 1 AND cl.date > DATE_SUB(NOW(), INTERVAL 30 DAY)')
      .andWhere('campaign.marketerId = :marketerId', { marketerId })
      .groupBy('cl.creatorId')
      .orderBy('total_ad_exposure_amount', 'DESC')
      .limit(100)
      .getRawMany();
  }

  // * 마케터 캠페인 분석에 사용되는 크리에이터 데이터 -> 캠페인별
  public async findCreatorDataByCampaign(
    campaignId: string,
  ): Promise<FindCreatorDataByCampaignRes> {
    return this.createFindCreatorDataByCampaignBase(campaignId)
      .addSelect('SUM(cashFromMarketer) AS total_ad_exposure_amount')
      .orderBy('total_ad_exposure_amount', 'DESC')
      .getRawMany();
  }

  // * 마케터 CPS 캠페인 분석에 사용되는 크리에이터 데이터 -> 캠페인별
  public async findCreatorDataByCpsCampaign(campaignId: string): Promise<FindCreatorDataCpsRes> {
    return this.createFindCreatorDataByCampaignBase(campaignId)
      .addSelect('COUNT(*) AS total_sales_amount')
      .orderBy('total_sales_amount', 'DESC')
      .getRawMany();
  }

  // * 마케터 광고캐시 소진 내역
  public async findCashUsageFromCampaignLog(
    marketerId: string,
    targetMonth?: string,
  ): Promise<FindUsageHistoryResObj[]> {
    const qb = this.createQueryBuilder('cl')
      .select(`DATE_FORMAT(cl.date, "%y년 %m월") as date, FORMAT(sum(cashFromMarketer), 0) as cash`)
      .where(`SUBSTRING_INDEX(cl.campaignId, '_', 1) = :marketerId AND type != "CPS"`, {
        marketerId,
      })
      .orderBy('cl.date', 'DESC');

    if (targetMonth) {
      return qb
        .andWhere('DATE_FORMAT(cl.date, "%y년 %m월") = :targetMonth', { targetMonth })
        .groupBy('DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type')
        .getRawMany();
    }
    return qb.groupBy('month(cl.date)').getRawMany();
  }

  // * 마케터 캠페인 분석에 사용되는 크리에이터 데이터를 조회하기 위한 중복되는 쿼리를 생성해주는 메서드
  private createFindCreatorDataByCampaignBase(campaignId: string) {
    return this.createQueryBuilder('cl')
      .select(
        `ci.creatorId AS id,
        ci.creatorId AS creatorId, 
        ci.creatorName AS creatorTwitchName,
        ci.creatorTwitchId AS creatorTwitchId,
        ci.creatorLogo AS creatorLogo, 
        ci.afreecaId,
        ci.afreecaName,
        ci.afreecaLogo,
        cd.viewer AS viewer,
        cd.followers AS followers, 
        cd.airtime AS airtime, 
        cd.impression AS impression, 
        cd.openHour AS openHour, 
        cd.content AS content,
        cd.ctr,
        cd.contentsGraphData,
        cd.timeGraphData,
        cda.contentsGraphData AS contentsGraphDataAfreeca,
        cda.timeGraphData  AS timeGraphDataAfreeca,
        cda.viewer AS viewerAfreeca,
        cda.ctr AS ctrAfreeca,
        cda.followers AS followersAfreeca, 
        cda.airtime AS airtimeAfreeca, 
        cda.impression AS impressionAfreeca, 
        cda.openHour AS openHourAfreeca, 
        cda.content AS contentAfreeca,
        MAX(cl.date) AS recentDate`,
      )
      .innerJoin(CreatorInfo, 'ci', 'cl.creatorId = ci.creatorId')
      .leftJoin(CreatorDetail, 'cd', 'cl.creatorId = cd.creatorId')
      .leftJoin(CreatorDetailAfreeca, 'cda', 'cl.creatorId = cda.creatorId')
      .where('ci.arrested != 1  AND (cd.impression != 0 OR cda.impression != 0)')
      .andWhere('campaignId = :campaignId', { campaignId })
      .groupBy('cl.creatorId');
  }
}
