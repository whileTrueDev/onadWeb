import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { BannerRegistered } from '../../../entities/BannerRegistered';
import { Campaign } from '../../../entities/Campaign';
import { CampaignTimestamp } from '../../../entities/CampaignTimestamp';
import { LinkRegistered } from '../../../entities/LinkRegistered';
import { MerchandiseMallItems } from '../../../entities/MerchandiseMallItems';
import { MerchandiseRegistered } from '../../../entities/MerchandiseRegistered';
import { CreatorCampaignRepository } from '../../../repositories/CreatorCampaign.repository';
import { CreatorInfoRepository } from '../../../repositories/CreatorInfo.repository';
import { UpdateRemoteOnOffDto } from './dto/updateRemoteOnOffDto.dto';
import {
  FindCampaignsRemoteControlRes,
  FindCampaignsRemoteControlResult,
} from './interfaces/findCampaignsRemoteControlRes.interface';

@Injectable()
export class RemoteService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(CreatorInfoRepository)
    private readonly creatorInfoRepo: CreatorInfoRepository,
    @InjectRepository(CreatorCampaignRepository)
    private readonly creatorCampaignRepo: CreatorCampaignRepository,
  ) {}

  // * remote control 페이지 URL 조회
  public async findRemotePageUrl(creatorId: string): Promise<string> {
    const creator = await this.creatorInfoRepo.findOne({
      select: ['remoteControllerUrl'],
      where: { creatorId },
    });
    return creator.remoteControllerUrl;
  }

  // * 크리에이터 캠페인 목록 정보 - remote 페이지에 보여질 목록
  public async findCampaignsRemoteControl(
    _remoteControllerUrl: string,
  ): Promise<FindCampaignsRemoteControlRes> {
    const remoteControllerUrl = this.__getCorrectRemoteControllerUrl(_remoteControllerUrl);

    // remoteurl을 통해 크리에이터 정보 조회
    const creator = await this.creatorInfoRepo.findOne({
      select: ['creatorId', 'creatorName', 'afreecaName'],
      where: { remoteControllerUrl },
    });
    if (!creator) throw new BadRequestException('remotecontrollerurl is not correct');

    // 캠페인 목록 조회
    const campaignList = await this.__findCampaignList(creator.creatorId);

    // pausedList 조회
    const pausedList = await this.creatorCampaignRepo.__getPausedCampaignList(creator.creatorId);

    // 캠페인 목록에서 paused 캠페인을 필터링
    const filtered = campaignList.map(campaign => {
      if (pausedList.includes(campaign.campaignId)) {
        return { ...campaign, state: 0, creatorName: creator.creatorName || creator.afreecaName };
      }
      return campaign;
    });

    return filtered.map(camp => ({
      ...camp,
      targetList: JSON.parse(camp.targetList).targetList,
      creatorName: creator.creatorName || creator.afreecaName,
    }));
  }

  // * 크리에이터 캠페인 pause 처리 (remote 페이지에서 토글버튼으로 제어)
  public async updateRemoteOnOff(dto: UpdateRemoteOnOffDto): Promise<boolean> {
    const { creatorId } = await this.creatorInfoRepo.findOne({
      select: ['creatorId'],
      where: { remoteControllerUrl: this.__getCorrectRemoteControllerUrl(dto.url) },
    });

    // pausedList 조회
    let pausedList = await this.creatorCampaignRepo.__getPausedCampaignList(creatorId);

    if (Number(dto.state) === 1) {
      const newCampaignList = pausedList.concat(dto.campaignId);
      pausedList = newCampaignList;
    } else {
      pausedList.splice(pausedList.indexOf(dto.campaignId), 1);
    }

    // pausedList 업데이트
    const result = await this.creatorCampaignRepo.update(
      { creatorId },
      { pausedList: JSON.stringify({ campaignList: pausedList }) },
    );
    if (result.affected > 0) return true;
    return false;
  }

  // ************************************
  // * Private methods
  // ************************************

  // * remote controller url "/" 처리
  private __getCorrectRemoteControllerUrl(url: string): string {
    return !url.startsWith('/') ? `/${url}` : url;
  }

  // * remote 페이지 캠페인 목록 찾기
  private async __findCampaignList(creatorId: string): Promise<FindCampaignsRemoteControlResult[]> {
    return this.connection.manager
      .createQueryBuilder()
      .select(
        `optionType,
      campaign.campaignId, campaign.marketerName, priorityType, targetList, CT.date, campaign.onOff as state,
      campaign.campaignDescription,
      MR.id AS merchandiseId, MR.name AS merchandiseName, MR.price AS merchandisePrice, itemSiteUrl,
      BR.bannerSrcUrl AS bannerSrc`,
      )
      .from(
        qb =>
          qb
            .select('creatorId, campaignId , min(date) as date ')
            .from(CampaignTimestamp, 'campaignTimestamp')
            .where('creatorId = :creatorId', { creatorId })
            .groupBy('campaignId'),
        'CT',
      )
      .innerJoin(Campaign, 'campaign', 'CT.campaignId = campaign.campaignId')
      .innerJoin(BannerRegistered, 'BR', 'campaign.bannerId = BR.bannerId')
      .leftJoin(LinkRegistered, 'IR', 'connectedLinkId = IR.linkId')
      .leftJoin(MerchandiseRegistered, 'MR', 'MR.id = campaign.merchandiseId')
      .leftJoin(MerchandiseMallItems, 'MMI', 'MMI.merchandiseId = campaign.merchandiseId')
      .where('campaign.onOff = 1')
      .orderBy('date', 'DESC')
      .getRawMany();
  }
}
