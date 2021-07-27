import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../../../dto/paginationDto.dto';
import { Campaign } from '../../../../entities/Campaign';
import { LinkRegistered } from '../../../../entities/LinkRegistered';
import { CreateLandingUrlDto } from './dto/createLandingUrlDto.dto';

@Injectable()
export class LandingUrlService {
  COLUMN_PREFIX = 'link_';
  DEFAULT_CONFIRM_STATE = 0;
  constructor(
    @InjectRepository(LinkRegistered) private readonly landingUrlRepo: Repository<LinkRegistered>,
    @InjectRepository(Campaign) private readonly campaignRepo: Repository<Campaign>,
  ) {}

  // * landingUrl 생성
  async createLandingUrl(marketerId: string, dto: CreateLandingUrlDto): Promise<LinkRegistered> {
    const lastLandingUrl = await this.landingUrlRepo.findOne({
      where: { marketerId },
      order: { regiDate: 'DESC' },
    });

    const linkId = this.getNewLandingUrlId(marketerId, lastLandingUrl);
    return this.landingUrlRepo.save({
      linkId,
      marketerId,
      confirmState: this.DEFAULT_CONFIRM_STATE,
      links: JSON.stringify({ links: dto.links }),
    });
  }

  // * landingUrl 삭제
  async deleteLandingUrl(marketerId: string, linkId: string): Promise<boolean> {
    if (!marketerId || !linkId) return false;
    const result = await this.landingUrlRepo.delete({ marketerId, linkId });
    if (result.affected > 0) return true;
    return false;
  }

  // * landing Url 조회
  async findLandingUrls(marketerId: string): Promise<Array<{ id: string } & LinkRegistered>> {
    const urls = await this.landingUrlRepo.find({
      where: { marketerId },
      order: { regiDate: 'DESC' },
    });

    return urls.map(url => ({
      ...url,
      id: url.linkId,
      links: JSON.parse(url.links),
    }));
  }

  // * landingUrl 조회 - 페이지네이션
  async findLandingUrlsPaginated(
    marketerId: string,
    dto: Partial<PaginationDto>,
  ): Promise<Array<{ id: string } & LinkRegistered>> {
    const searchPage = Math.round(Number(dto.page) * Number(dto.offset));
    const searchOffset = Number(dto.offset);
    const urlList = await this.landingUrlRepo.find({
      where: { marketerId },
      take: searchOffset,
      skip: searchPage,
      order: { regiDate: 'DESC' },
    });
    return urlList.map(url => ({
      ...url,
      id: url.linkId,
      links: JSON.parse(url.links),
    }));
  }

  // * landingUrl 갯수 조회
  async findAllLandingUrlCounts(marketerId: string): Promise<number> {
    return this.landingUrlRepo.count({ where: { marketerId } });
  }

  // * landingUrl에 연결된 campaign 조회
  async findCampaignByLandingUrl(
    marketerId: string,
    landingUrlId: string,
  ): Promise<Pick<Campaign, 'campaignId'>[]> {
    const campaigns = await this.campaignRepo.find({
      where: { connectedLinkId: landingUrlId, marketerId, deletedState: 0 },
    });

    return campaigns.map(x => ({ campaignId: x.campaignId }));
  }

  // *************************************
  // * Private methods
  // *************************************

  // * landingUrl 프라이머리 키 생성
  private getNewLandingUrlId(marketerId: string, lastLandingUrl?: LinkRegistered): string {
    if (!lastLandingUrl) return `${this.COLUMN_PREFIX}${marketerId}_01`;
    const count = parseInt(lastLandingUrl.linkId.split('_')[2], 10) + 1;
    if (count < 10) return `${this.COLUMN_PREFIX}${marketerId}_0${count}`;
    return `${this.COLUMN_PREFIX}${marketerId}_${count}`;
  }
}
