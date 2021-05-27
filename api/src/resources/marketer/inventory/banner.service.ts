import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import path from 'path';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../../dto/paginationDto.dto';
import { BannerRegistered } from '../../../entities/BannerRegistered';
import { Campaign } from '../../../entities/Campaign';
import * as s3 from '../../../utils/s3';
import { FindAllBannersConfirmedRes } from './interfaces/findAllBannersConfirmedRes.interface';
import { FindCampaignByBannerIdRes } from './interfaces/findCampaignByBannerIdRes.interface';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerRegistered) private readonly bannerRepo: Repository<BannerRegistered>,
    @InjectRepository(Campaign) private readonly campaignRepo: Repository<Campaign>,
  ) {}

  async findBannersPaginated(
    marketerId: string,
    dto: Partial<PaginationDto>,
  ): Promise<Array<BannerRegistered & { id: string }>> {
    const searchPage = Number(dto.page) * Number(dto.offset);
    const searchOffset = Number(dto.offset);
    const banners = await this.bannerRepo.find({
      select: ['bannerSrcUrl', 'bannerId', 'confirmState', 'bannerDenialReason', 'regiDate'],
      where: { marketerId },
      take: searchOffset,
      skip: searchPage,
      order: { confirmState: 'ASC', regiDate: 'DESC' },
    });
    return banners.map(banner => ({
      ...banner,
      id: banner.bannerId,
      bannerSrc: banner.bannerSrcUrl,
    }));
  }

  // * 배너 생성
  async createBanner(marketerId: string, bannerSrc: string): Promise<BannerRegistered> {
    const lastBanner = await this.bannerRepo.findOne({
      where: { marketerId },
      order: { regiDate: 'DESC' },
    });
    const bannerId = this.getNewBannerId(marketerId, lastBanner);
    const { bannerImgBuffer, contentType, fileExt } = this.decodeBase64Banner(bannerSrc);

    const BANNER_FILE_PATH = path.join('banner', marketerId, `${bannerId}.${fileExt}`);

    await s3
      .uploadImageAsync(BANNER_FILE_PATH, bannerImgBuffer, { ContentType: contentType })
      .catch(err => {
        throw new InternalServerErrorException(
          `Error occurred during upload an banner image to AWS S3 \n${err}`,
        );
      });

    const newBanner = this.bannerRepo.create({
      bannerId,
      marketerId,
      bannerSrcUrl: s3.getBaseUrl() + BANNER_FILE_PATH,
      bannerSrc: '',
      confirmState: 0,
    });
    const result = await this.bannerRepo.save(newBanner);

    return result;
  }

  // * 배너 삭제
  async deleteBanner(marketerId: string, bannerId: string): Promise<boolean> {
    if (!marketerId || !bannerId) return false;
    const result = await this.bannerRepo.delete({ marketerId, bannerId });
    if (result.affected > 0) return true;
    return false;
  }

  // * 거절상태가 아닌 모든 배너 조회
  async findAllBannersConfirmed(marketerId: string): Promise<FindAllBannersConfirmedRes> {
    const banners = await this.bannerRepo.find({
      where: [
        { confirmState: 0, marketerId },
        { confirmState: 1, marketerId },
      ],
      select: ['bannerId', 'bannerSrcUrl'],
    });

    return banners.map(banner => ({ ...banner, bannerSrc: banner.bannerSrcUrl }));
  }

  // * 모든 배너 개수 조회
  async findAllBannersCount(marketerId: string): Promise<number> {
    return this.bannerRepo.count({ where: { marketerId } });
  }

  // * 배너가 할당된 캠페인 조회
  async findCampaignByBannerId(bannerId: string): Promise<FindCampaignByBannerIdRes> {
    return this.campaignRepo.find({ where: { bannerId, deletedState: 0 }, select: ['campaignId'] });
  }

  // ******************************************
  // * Private methods
  // ******************************************

  /**
   * 마케터의 최신 배너에 기반하여 배너 아이디를 생성합니다.
   * @param marketerId 마케터아이디
   * @param lastBanner 현재 마케터의 최신 배너
   * @returns {string} 새로운 배너아이디
   */
  private getNewBannerId(marketerId: string, lastBanner?: BannerRegistered): string {
    if (!lastBanner) return `${marketerId}_01`;
    const count = parseInt(lastBanner.bannerId.split('_')[1], 10) + 1;
    if (count < 10) return `${marketerId}_0${count}`;
    return `${marketerId}_${count}`;
  }

  /**
   * Base64로 인코딩된 배너이미지를 파싱합니다.
   * @param base64Banner 배너base64 string
   * @returns {object} { bannerImgBuffer: 배너 이미지버퍼, contentType: data:image 와 같은 타입, fileExt: png, mp4와 같은 확장자}
   */
  private decodeBase64Banner(
    base64Banner: string,
  ): {
    bannerImgBuffer: Buffer;
    contentType: string;
    fileExt: string;
  } {
    const fileType = base64Banner.substring('data:'.length, base64Banner.indexOf(';base64'));

    let bannerImg: any;
    let extension = '';

    if (fileType.startsWith('image/')) {
      extension = base64Banner.substring('data:image/'.length, base64Banner.indexOf(';base64'));
      bannerImg = Buffer.from(base64Banner.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    }
    if (fileType.startsWith('video/')) {
      bannerImg = Buffer.from(base64Banner.replace(/^data:video\/\w+;base64,/, ''), 'base64');
      extension = base64Banner.substring('data:video/'.length, base64Banner.indexOf(';base64'));
    }

    return {
      bannerImgBuffer: bannerImg,
      contentType: fileType,
      fileExt: extension,
    };
  }
}
