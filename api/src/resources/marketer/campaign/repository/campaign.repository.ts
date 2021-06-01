import { Injectable } from '@nestjs/common';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { BannerRegistered } from '../../../../entities/BannerRegistered';
import { Campaign } from '../../../../entities/Campaign';
import { CampaignLog } from '../../../../entities/CampaignLog';
import { CreatorInfo } from '../../../../entities/CreatorInfo';
import { LinkRegistered } from '../../../../entities/LinkRegistered';
import { MerchandiseMallItems } from '../../../../entities/MerchandiseMallItems';
import { MerchandiseRegistered } from '../../../../entities/MerchandiseRegistered';
import { CampaignPriorityType } from '../interfaces/campaignPriorityType.enum';
import { CampaignDetail, FindCampaignRes } from '../interfaces/findCampaignRes.interface';

@Injectable()
@EntityRepository(Campaign)
export class CampaignRepository extends Repository<Campaign> {
  // * 캠페인 조회 쿼리빌더 생성
  private getFindCampaignSnippet() {
    return this.createQueryBuilder('campaign')
      .select(
        `campaignId AS id, campaignId, campaignName, optionType, priorityType, 
      campaign.regiDate as regiDate, onOff, br.confirmState, 
      br.bannerId, br.bannerSrcUrl AS bannerSrc, br.regiDate AS bannerRegiDate,
      lr.linkId, lr.links as links, lr.confirmState as linkConfirmState, dailyLimit,
      campaignDescription, startDate, finDate, selectedTime, targetList, campaign.merchandiseId,
      mr.name AS merchandiseName, mr.stock AS merchandiseStock,
      mm.soldCount AS merchandiseSoldCount, mm.itemSiteUrl AS merchandiseItemSiteUrl,
      mm.uploadState AS merchandiseUploadState, mm.denialReason AS merchandiseDenialReason`,
      )
      .innerJoin(BannerRegistered, 'br', 'br.bannerId = campaign.bannerId')
      .leftJoin(LinkRegistered, 'lr', 'lr.linkId = connectedLinkId')
      .leftJoin(MerchandiseRegistered, 'mr', 'mr.id = campaign.merchandiseId')
      .leftJoin(MerchandiseMallItems, 'mm', 'mm.merchandiseId = campaign.merchandiseId');
  }

  // * 모든 캠페인 정보 조회 (pagination)
  public async findAllCampaigns(
    marketerId: string,
    page: number,
    offset: number,
  ): Promise<FindCampaignRes[]> {
    const sql = this.getFindCampaignSnippet()
      .where('campaign.marketerId = :marketerId', { marketerId })
      .andWhere('campaign.deletedState = 0')
      .orderBy('campaign.onOff', 'DESC')
      .addOrderBy('campaign.regiDate', 'DESC')
      .limit()
      .getSql();

    // skip, take 안먹힘.
    const query = `${sql} LIMIT ?, ?`;
    const result: CampaignDetail[] = await this.query(query, [marketerId, page, offset]);

    return Promise.all(result.map(campaign => this.getCampaignDetailData(campaign)));
  }

  // * 개별 캠페인 정보 조회
  public async findOneCampaign(campaignId: string): Promise<FindCampaignRes> {
    const campaign: CampaignDetail = await this.getFindCampaignSnippet()
      .where('campaign.campaignId = :campaignId', { campaignId })
      .andWhere('campaign.deletedState = 0')
      .orderBy('campaign.onOff', 'DESC')
      .addOrderBy('campaign.regiDate', 'DESC')
      .getRawOne();
    if (campaign) return this.getCampaignDetailData(campaign);
    return null;
  }

  // * 캠페인 일일 예산 정보 변경
  public async updateCampaignBudget({
    campaignId,
    newBudget,
    limitState,
  }: {
    campaignId: string;
    newBudget: number;
    limitState: 0 | 1;
  }): Promise<boolean> {
    const reuslt = await this.createQueryBuilder()
      .update()
      .set({ dailyLimit: newBudget, limitState })
      .where('campaignId = :campaignId', { campaignId })
      .execute();
    if (reuslt.affected > 0) return true;
    return false;
  }

  /**
   * * 캠페인 기본 정보에 부가적 정보를 추가합니다.
   * 기본 캠페인 정보에, 캠페인 별 금일 예산 사용량, 타겟 크리에이터 정보를  캠페인 정보를 가져와 추가합니다.
   * @param campaign 캠페인 데이터
   * @returns 일일예산 데이터와 타겟 크리에이터 정보가 추가된 캠페인
   */
  private async getCampaignDetailData(campaign: CampaignDetail): Promise<FindCampaignRes> {
    // *******************************************************************
    // 캠페인 별 금일 예산 사용량 불러오기  +  타겟 크리에이터 정보 불러오기

    // 오늘자 일일예산에 대한 예산소비량을 체크하기 위해 오늘의 맨처음 시간으로 설정
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const conn = getConnection();
    const dailySum: { dailysum: number } = await conn
      .createQueryBuilder(CampaignLog, 'cl')
      .select('SUM(cashFromMarketer) AS dailysum')
      .where('campaignId = :campaignId', { campaignId: campaign.campaignId })
      .andWhere('date > :date', { date })
      .getRawOne();

    const linkData = JSON.parse(campaign.links);
    const selectedTime = JSON.parse(campaign.selectedTime).time;
    const { targetList } = JSON.parse(campaign.targetList);

    if (String(campaign.priorityType) === CampaignPriorityType.특정크리에이터송출) {
      const creatorInfos = await conn
        .createQueryBuilder(CreatorInfo, 'cl')
        .select(
          'creatorId, creatorName, creatorTwitchId, creatorLogo, afreecaId, afreecaName, afreecaLogo',
        )
        .whereInIds(targetList)
        .getRawMany();

      return {
        ...campaign,
        linkData,
        dailysum: dailySum.dailysum,
        selectedTime,
        targetList,
        targetCreators: creatorInfos,
      };
    }
    return {
      ...campaign,
      linkData,
      dailysum: dailySum.dailysum,
      selectedTime,
      targetList,
    };
  }
}
