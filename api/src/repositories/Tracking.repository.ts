import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Tracking } from '../entities/Tracking';
import { FindCpsExpenditureDataObj } from '../resources/marketer/campaign/interfaces/findCpsExpenditureDataRes.interface';
import { FindHeatmapDataResObj } from '../resources/marketer/campaign/interfaces/FindHeatmapDataRes.interface';

@Injectable()
@EntityRepository(Tracking)
export class TrackingRepository extends Repository<Tracking> {
  // * 캠페인 분석 - 클릭 히트맵 분석 데이터
  public async findCampaignAnalysisHeatmapData(
    campaignId: string,
  ): Promise<FindHeatmapDataResObj[]> {
    return this.createQueryBuilder('tracking')
      .select('DATE_FORMAT(clickedTime, "%Y-%m-%d") AS date, count(campaignId) AS count')
      .where('campaignId = :campaignId', { campaignId })
      .groupBy('DATE_FORMAT(clickedTime, "%Y-%m-%d")')
      .orderBy('DATE_FORMAT(clickedTime, "%Y-%m-%d")', 'DESC')
      .getRawMany();
  }

  // * 월간, 일별 CPS 클릭 데이터 - (for CPS캠페인 분석 차트 데이터)
  public async findMohthlyCpsClicks(campaignId: string): Promise<FindCpsExpenditureDataObj[]> {
    return this.createQueryBuilder()
      .select('createdAt, COUNT(*) AS amount')
      .where('os IS NOT NULL AND costType = "CPS" AND DATE_SUB(createdAt, INTERVAL 1 MONTH)')
      .andWhere('campaignId = :campaignId', { campaignId })
      .groupBy('DATE_FORMAT(createdAt, "%y년 %m월 %d일")')
      .orderBy('createdAt', 'ASC')
      .getRawMany();
  }
}
