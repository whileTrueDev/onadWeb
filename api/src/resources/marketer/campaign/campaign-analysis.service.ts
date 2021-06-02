import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { FindAnalysisDataRes } from './interfaces/findAnalysisDataRes.interface';
import {
  FindCreatorDataByCampaignRes,
  FindCreatorDataCpsRes,
  FindCreatorDataRes,
} from './interfaces/findCreatorDataRes.interface';
import { FindExpenditureDataRes } from './interfaces/findExpenditureDataRes.interface';
import { CampaignLogRepository } from '../../../repositories/CampaignLog.repository';
import { TrackingRepository } from '../../../repositories/Tracking.repository';
import { FindHeatmapDataRes } from './interfaces/FindHeatmapDataRes.interface';
import { FindCpsAnalysisDataRes } from './interfaces/findCpsAnalysisDataRes.interface';
import {
  FindCpsExpenditureDataRes,
  FindCpsExpenditureDataResObj,
} from './interfaces/findCpsExpenditureDataRes.interface';

@Injectable()
export class CampaignAnalysisService {
  constructor(
    @InjectRepository(CampaignLogRepository)
    private readonly campaignLogRepo: CampaignLogRepository,
    @InjectRepository(TrackingRepository)
    private readonly trackingRepo: TrackingRepository,
  ) {}

  // * 캠페인 분석 - 캠페인 상세 분석 데이터
  public async findAnalysisData(campaignId: string): Promise<FindAnalysisDataRes> {
    const conn = getConnection();
    const query = `SELECT 
    (SELECT campaignName  FROM campaign  WHERE campaignId = ?) AS campaignName,
    (SELECT SUM(cashFromMarketer) FROM campaignLog as cl WHERE campaignId= ? AND type="CPM") AS totalCPM,
    (SELECT SUM(viewer) FROM campaignLog as cl WHERE campaignId= ? AND type="CPM" AND viewer IS NOT NULL) AS totalViewCount,
    (SELECT SUM(cashFromMarketer) FROM campaignLog WHERE campaignId= ? AND type="CPC") AS totalCPC,
    (SELECT COUNT(*) FROM tracking WHERE campaignId = ? AND channel = 'adchat' AND os IS NOT NULL) AS adchatClick,
    (SELECT COUNT(*) FROM tracking  WHERE campaignId = ? AND channel = "adpanel"  AND os IS NOT NULL) AS adpanelClick`;
    const result = await conn.query(query, new Array(6).fill(campaignId));
    if (result && result.length > 0) return result[0];
    return null;
  }

  // * 캠페인 분석 - 차트 데이터
  public async findExpenditureChartData(campaignId: string): Promise<FindExpenditureDataRes[]> {
    return this.campaignLogRepo.findExpenditureData(campaignId);
  }

  // * 마케터 캠페인 분석에 사용되는 크리에이터 데이터 - 광고주별
  public async findCreatorData(marketerId: string): Promise<FindCreatorDataRes> {
    return this.campaignLogRepo.findCreatorData(marketerId);
  }

  // * 마케터 캠페인 분석에 사용되는 크리에이터 데이터 - 캠페인별
  public async findCreatorDataByCampaign(
    campaignId: string,
  ): Promise<FindCreatorDataByCampaignRes> {
    return this.campaignLogRepo.findCreatorDataByCampaign(campaignId);
  }

  // * 클릭 히트맵 분석 데이터
  public async findHeatmapData(campaignId: string): Promise<FindHeatmapDataRes> {
    return this.trackingRepo.findCampaignAnalysisHeatmapData(campaignId);
  }

  /**
   * * CPS 캠페인 분석 데이터 조회
   * 캠페인 분석 정보를 가져옵니다. (총 판매액, 총 상품 클릭수, 총 상품 판매수)
   * @param campaignId 캠페인 고유 아이디
   * @returns CpsAnalysisData | null
   */
  public async findCpsAnalysisData(campaignId: string): Promise<FindCpsAnalysisDataRes> {
    const conn = getConnection();
    const query = `SELECT
    (SELECT SUM(salesIncomeToMarketer) FROM campaignLog as cl WHERE campaignId = ? AND type = "CPS") AS totalSalesIncome,
    (SELECT COUNT(*) FROM tracking WHERE campaignId = ? AND channel = 'adchat' AND os IS NOT NULL AND costType = "CPS") AS adchatClick,
    (SELECT COUNT(*) FROM tracking WHERE campaignId = ? AND channel = 'adpanel' AND os IS NOT NULL AND costType = "CPS") AS adpanelClick,
    (SELECT COUNT(*) FROM campaignLog WHERE campaignId = ? AND type = "CPS") AS totalSalesAmount
    `;
    const result = await conn.query(query, new Array(5).fill(campaignId));
    if (!result || result.length === 0) return null;
    return result[0];
  }

  // * CPS 캠페인 분석 - 차트 데이터
  public async findCpsExpenditureChartData(campaignId: string): Promise<FindCpsExpenditureDataRes> {
    const clicks = await this.trackingRepo.findMohthlyCpsClicks(campaignId);
    const sales = await this.campaignLogRepo.findMonthlyCpsSales(campaignId);

    const dataArray: FindCpsExpenditureDataResObj[] = [];
    clicks.forEach(value => {
      const obj = { date: value.createdAt, value: value.amount, type: '클릭' as const };
      dataArray.push(obj);
    });
    sales.forEach(value => {
      const obj = { date: value.createdAt, value: value.amount, type: '판매' as const };
      dataArray.push(obj);
    });
    return dataArray;
  }

  public async findCpsCreators(campaignId: string): Promise<FindCreatorDataCpsRes> {
    return this.campaignLogRepo.findCreatorDataByCpsCampaign(campaignId);
  }
}
