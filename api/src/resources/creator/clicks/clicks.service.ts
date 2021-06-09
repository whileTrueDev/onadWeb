import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../../../dto/paginationDto.dto';
import { Campaign } from '../../../entities/Campaign';
import { CampaignLog } from '../../../entities/CampaignLog';
import { LinkRegistered } from '../../../entities/LinkRegistered';
import { MerchandiseMallItems } from '../../../entities/MerchandiseMallItems';
import { OnadBannerClickPath } from '../../../interfaces/OnadBannerClickPath.interface';
import { CampaignLogRepository } from '../../../repositories/CampaignLog.repository';
import { TrackingRepository } from '../../../repositories/Tracking.repository';
import {
  FindCurrentClicksRes,
  FindCurrentClicksResult,
} from './interfaces/FindCurrentClicksRes.interface';

@Injectable()
export class ClicksService {
  constructor(
    @InjectRepository(TrackingRepository) private readonly trackingRepo: TrackingRepository,
    @InjectRepository(CampaignLogRepository)
    private readonly campaignLogRepo: CampaignLogRepository,
  ) {}

  // * 클릭 정보 조회
  public async findClicks(creatorId: string): Promise<Record<OnadBannerClickPath, number>> {
    const clicks = await this.trackingRepo
      .createQueryBuilder()
      .select('channel, count(*) AS count')
      .where('creatorId = :creatorId', { creatorId })
      .groupBy('channel')
      .getRawMany();

    const result: Record<OnadBannerClickPath, number> = { adpanel: 0, adchat: 0 };
    clicks.forEach(click => {
      result[click.channel] = click.count ? Number(click.count) : 0;
    });
    return result;
  }

  // * 최근 클릭 정보
  public async findCurrentClicks(
    creatorId: string,
    dto: PaginationDto,
  ): Promise<FindCurrentClicksRes> {
    const realOffset = Number(dto.offset);
    const realPage = Number(dto.page) * realOffset;
    const [sql, params] = this.trackingRepo
      .createQueryBuilder('tracking')
      .select(
        'tracking.id, clickedTime, costType, tracking.linkId, campaign.campaignName, links, creatorId, payout, channel, os, browser, campaign.merchandiseId, itemSiteUrl',
      )
      .innerJoin(Campaign, 'campaign', 'campaign.campaignId = tracking.campaignid')
      .leftJoin(LinkRegistered, 'lr', 'lr.linkId = tracking.linkId')
      .leftJoin(MerchandiseMallItems, 'mmi', 'mmi.merchandiseId = campaign.merchandiseId')
      .where('creatorId = :creatorId', { creatorId })
      .orderBy('clickedTime', 'DESC')
      .getQueryAndParameters();

    const result: FindCurrentClicksResult[] = await this.trackingRepo.manager.query(
      `${sql}\nLIMIT ?, ?`,
      params.concat(realPage, realOffset),
    );

    return result.map(click => ({
      ...click,
      links: JSON.parse(click.links),
    }));
  }

  // * 클릭광고로 첫 수익 달성 여부 조회
  public async clickStartCheck(creatorId: string): Promise<CampaignLog> {
    return this.campaignLogRepo.findOne({
      where: { creatorId, type: 'CPC' },
      order: { date: 'DESC' },
    });
  }
}
