import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { Connection } from 'typeorm';
import { PaginationDto } from '../../../dto/paginationDto.dto';
import { BannerRegistered } from '../../../entities/BannerRegistered';
import { Campaign } from '../../../entities/Campaign';
import { CampaignLog } from '../../../entities/CampaignLog';
import { CampaignTimestamp } from '../../../entities/CampaignTimestamp';
import { LinkRegistered } from '../../../entities/LinkRegistered';
import { MarketerInfo } from '../../../entities/MarketerInfo';
import { MerchandiseMallItems } from '../../../entities/MerchandiseMallItems';
import { MerchandiseRegistered } from '../../../entities/MerchandiseRegistered';
import { CampaignLogRepository } from '../../../repositories/CampaignLog.repository';
import { CreatorCampaignRepository } from '../../../repositories/CreatorCampaign.repository';
import { CreatorInfoRepository } from '../../../repositories/CreatorInfo.repository';
import {
  FindBannerIncomeListResult,
  FindBannerListRes,
  FindBannerListResObj,
  FindBannerListResult,
} from './interfaces/findBannerListRes.interface';
import { FindBannerOverlayRes } from './interfaces/findBannerOverlayRes.interface';
import { FindNowActiveBannerRes } from './interfaces/findNowActiveBannerRes.interface';

@Injectable()
export class BannerService {
  BANNER_OVERLAY_DOMAIN = 'https://banner.onad.io/banner';

  constructor(
    @InjectRepository(CreatorCampaignRepository)
    private readonly creatorCampaignRepo: CreatorCampaignRepository,
    @InjectRepository(CampaignLogRepository)
    private readonly campaignLogRepo: CampaignLogRepository,
    @InjectRepository(CreatorInfoRepository)
    private readonly creatorInfoRepo: CreatorInfoRepository,
    private readonly connection: Connection,
  ) {}

  // * 특정 크리에이터가 특정 배너 밴
  public async banBanner(creatorId: string, campaignId: string): Promise<boolean> {
    // 밴목록 찾기
    const creatorCampaign = await this.creatorCampaignRepo.findOne({ where: { creatorId } });
    const banList = JSON.parse(creatorCampaign.banList) as { campaignList: string[] };

    // 이미 밴된 캠페인인 경우, 바로 성공으로 처리
    if (banList.campaignList.includes(campaignId)) return true;

    // 해당 캠페인이 추가된 새로운 밴 목록으로 업데이트
    const newBanList = banList.campaignList.concat(campaignId);
    const result = await this.creatorCampaignRepo.update(
      { creatorId: creatorCampaign.creatorId },
      { banList: JSON.stringify({ campaignList: newBanList }) },
    );
    if (result.affected > 0) return true;
    return false;
  }

  // * 배너 광고로 첫 수익 달성 여부 조회
  public async bannerStartCheck(creatorId: string): Promise<CampaignLog> {
    return this.campaignLogRepo.findOne({
      where: { creatorId, type: 'CPM' },
      order: { date: 'DESC' },
    });
  }

  // * 크리에이터 배너 목록 정보
  public async findBannerList(creatorId: string, dto: PaginationDto): Promise<FindBannerListRes> {
    const realOffset = Number(dto.offset);
    const startNum = Number(dto.page) * realOffset;

    // 밴목록 찾기
    const creatorCampaign = await this.creatorCampaignRepo.findOne({ where: { creatorId } });
    const banList = JSON.parse(creatorCampaign.banList) as { campaignList: string[] };
    // 배너 목록 조회
    const banners = await this.__findBannerList(creatorId, startNum, realOffset);

    return this.__findIncomePerCampaign(banners, banList.campaignList);
  }

  // * 크리에이터 배너 오버레이 주소 조회
  public async findBannerOverlay(creatorId: string): Promise<FindBannerOverlayRes> {
    const creator = await this.creatorInfoRepo.findOne({
      where: { creatorId },
    });
    const advertiseUrl = join(this.BANNER_OVERLAY_DOMAIN, creator.advertiseUrl);
    return {
      advertiseUrl,
      creatorContractionAgreement: creator.creatorContractionAgreement,
    };
  }

  // * 크리에이터의 현재 송출 배너 정보 조회
  public async findNowActiveBanner(creatorId: string): Promise<FindNowActiveBannerRes> {
    return this.connection
      .createQueryBuilder()
      .select('cp.bannerId, bannerSrcUrl AS bannerSrc, cp.campaignName, cp.campaignDescription')
      .addSelect('lr.links, cp.regiDate, mi.profileImage, mi.marketerName, ct.date')
      .addSelect('mr.name AS merchandiseName, mmi.itemSiteUrl')
      .from(CampaignTimestamp, 'ct')
      .innerJoin(Campaign, 'cp', 'ct.campaignId = cp.campaignId')
      .innerJoin(MarketerInfo, 'mi', 'cp.marketerId = mi.marketerId')
      .innerJoin(BannerRegistered, 'br', 'cp.bannerId = br.bannerId')
      .leftJoin(LinkRegistered, 'lr', 'cp.connectedLinkId = lr.linkId')
      .leftJoin(MerchandiseRegistered, 'mr', 'cp.merchandiseId = mr.id')
      .leftJoin(MerchandiseMallItems, 'mmi', 'mr.id = mmi.merchandiseId')
      .where('creatorId = :creatorId', { creatorId })
      .andWhere('ct.date > DATE_ADD(NOW(), INTERVAL - 10 MINUTE)')
      .orderBy('ct.date', 'DESC')
      .getRawMany();
  }

  // * 배너 목록 조회 쿼리
  public async __findBannerList(
    creatorId: string,
    page: number,
    offset: number,
  ): Promise<FindBannerListResult[]> {
    const [sql, params] = this.connection
      .createQueryBuilder()
      .select(
        `CT.campaignId, CT.date, CT.creatorId,
          BR.bannerSrcUrl AS bannerSrc,
          campaign.connectedLinkId, campaign.onOff as state, campaign.marketerName,
          campaign.campaignDescription, campaign.priorityType, campaign.optionType, campaign.targetList,
          MI.marketerContraction, MI.profileImage,
          IR.links,
          itemSiteUrl, campaign.merchandiseId, MR.name AS merchandiseName`,
      )
      .from(
        qb =>
          qb
            .select('creatorId, campaignId , min(date) as date')
            .from(CampaignTimestamp, 'ct')
            .where('creatorId = :creatorId', { creatorId })
            .groupBy('campaignId'),
        'CT',
      )
      .innerJoin(Campaign, 'campaign', 'CT.campaignId = campaign.campaignId')
      .innerJoin(BannerRegistered, 'BR', 'campaign.bannerId = BR.bannerId')
      .leftJoin(LinkRegistered, 'IR', 'connectedLinkId = IR.linkId')
      .leftJoin(MarketerInfo, 'MI', 'campaign.marketerId = MI.marketerId')
      .leftJoin(MerchandiseRegistered, 'MR', 'campaign.merchandiseId = MR.id')
      .leftJoin(MerchandiseMallItems, 'MMI', 'campaign.merchandiseId = MMI.merchandiseId')
      .orderBy('campaign.onOff = 1 AND MI.marketerContraction = 1', 'DESC')
      .addOrderBy('CT.date', 'DESC')
      .getQueryAndParameters();

    const realSql = `${sql} LIMIT ?, ?`;
    return this.connection.manager.query(realSql, params.concat([page, offset]));
  }

  // **********************************
  // * Private methods
  // **********************************

  // * 배너별 수익금 정보 조회
  private async __findIncomePerCampaign(
    campaignList: FindBannerListResult[],
    banList: string[],
  ): Promise<FindBannerListRes> {
    const newList = await Promise.all(
      campaignList.map(async campaign => {
        const newCampaignData: FindBannerListResObj = { ...campaign, CPC: 0, CPM: 0, cash: 0 };
        const result: FindBannerIncomeListResult[] = await this.campaignLogRepo
          .createQueryBuilder('cl')
          .select('campaignId, type, sum(cashToCreator) as cash')
          .where('campaignId = :campaignId', { campaignId: campaign.campaignId })
          .andWhere('creatorId = :creatorId', { creatorId: campaign.creatorId })
          .groupBy('cl.type')
          .getRawMany();

        if (banList.includes(campaign.campaignId)) {
          newCampaignData.state = 0;
        }
        let cash = 0;
        result.forEach(cashData => {
          newCampaignData[cashData.type] = cashData.cash;
          cash += cashData.cash;
        });
        newCampaignData.cash = cash;
        return newCampaignData;
      }),
    );

    return newList.sort((x, y) => y.state - x.state);
  }
}
