import { Body, Controller, Delete, Get, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { Creator } from '../../../decorators/sessionData.decorator';
import { PaginationDto } from '../../../dto/paginationDto.dto';
import { CampaignLog } from '../../../entities/CampaignLog';
import { CreatorSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { BannerService } from './banner.service';
import { BanBannerDto } from './dto/banBannerDto.dto';
import { FindBannerListRes } from './interfaces/findBannerListRes.interface';
import { FindBannerOverlayRes } from './interfaces/findBannerOverlayRes.interface';
import { FindNowActiveBannerRes } from './interfaces/findNowActiveBannerRes.interface';

@UseGuards(IsAuthGuard)
@Controller('creator/banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Delete()
  banBanner(
    @Creator() { creatorId }: CreatorSession,
    @Body(ValidationPipe) dto: BanBannerDto,
  ): Promise<boolean> {
    return this.bannerService.banBanner(creatorId, dto.campaignId);
  }

  @Get('start-check')
  bannerStartCheck(@Creator() { creatorId }: CreatorSession): Promise<CampaignLog> {
    return this.bannerService.bannerStartCheck(creatorId);
  }

  @Get('list')
  findBannerList(
    @Creator() { creatorId }: CreatorSession,
    @Query(ValidationPipe) dto: PaginationDto,
  ): Promise<FindBannerListRes> {
    return this.bannerService.findBannerList(creatorId, dto);
  }

  @Get('overlay')
  findBannerOverlay(@Creator() { creatorId }: CreatorSession): Promise<FindBannerOverlayRes> {
    return this.bannerService.findBannerOverlay(creatorId);
  }

  @Get('active')
  findNowActiveBanner(@Creator() { creatorId }: CreatorSession): Promise<FindNowActiveBannerRes> {
    return this.bannerService.findNowActiveBanner(creatorId);
  }
}
