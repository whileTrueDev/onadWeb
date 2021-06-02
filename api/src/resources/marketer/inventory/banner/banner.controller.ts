import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Marketer } from '../../../../decorators/sessionData.decorator';
import { PaginationDto } from '../../../../dto/paginationDto.dto';
import { BannerRegistered } from '../../../../entities/BannerRegistered';
import { MarketerSession } from '../../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../../auth/guards/isAuth.guard';
import { SlackService } from '../../../slack/slack.service';
import { MarketerActionLogService, MarketerActionLogType } from '../../marketerActionLog.service';
import { BannerService } from './banner.service';
import { BannerIdDto } from './dto/bannerIdDto.dto';
import { CreateBannerDto } from './dto/createBannerDto.dto';
import { FindAllBannersConfirmedRes } from './interfaces/findAllBannersConfirmedRes.interface';
import { FindCampaignByBannerIdRes } from './interfaces/findCampaignByBannerIdRes.interface';

@Controller('marketer/banner')
export class BannerController {
  constructor(
    private readonly inventoryService: BannerService,
    private readonly actionLogService: MarketerActionLogService,
    private readonly slackService: SlackService,
  ) {}

  @UseGuards(IsAuthGuard)
  @Post()
  async createBanner(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: CreateBannerDto,
  ): Promise<[boolean, string]> {
    const newBanner = await this.inventoryService.createBanner(marketerId, dto.bannerSrc);
    if (newBanner) {
      this.actionLogService.createLog(
        marketerId,
        MarketerActionLogType.배너등록,
        JSON.stringify({ bannerId: newBanner.bannerId }),
      );
      this.slackService.jsonMessage({
        summary: '배너 등록 알림',
        text: '관리자 페이지에서 방금 등록된 배너를 확인하고, 심사하세요.',
        fields: [
          { title: '마케터 아이디', value: marketerId!, short: true },
          { title: '배너 아이디', value: newBanner.bannerId!, short: true },
        ],
      });

      return [true, '배너 등록이 완료되었습니다.'];
    }
    throw new InternalServerErrorException(
      '배너 등록 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    );
  }

  @UseGuards(IsAuthGuard)
  @Delete()
  async deleteBanner(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: BannerIdDto,
  ): Promise<boolean> {
    const isSuccess = await this.inventoryService.deleteBanner(marketerId, dto.bannerId);
    if (isSuccess) {
      // marketer action logging
      this.actionLogService.createLog(
        marketerId,
        MarketerActionLogType.배너삭제,
        JSON.stringify({ bannerId: dto.bannerId }),
      );
    }
    return isSuccess;
  }

  @UseGuards(IsAuthGuard)
  @Get('list')
  findBannersPaginated(
    @Marketer() { marketerId }: MarketerSession,
    @Query(ValidationPipe) dto: Partial<PaginationDto>,
  ): Promise<BannerRegistered[]> {
    return this.inventoryService.findBannersPaginated(marketerId, dto);
  }

  @UseGuards(IsAuthGuard)
  @Get('list/active')
  findAllBannersConfirmed(
    @Marketer() { marketerId }: MarketerSession,
  ): Promise<FindAllBannersConfirmedRes> {
    return this.inventoryService.findAllBannersConfirmed(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Get('length')
  findAllBannersCount(@Marketer() { marketerId }: MarketerSession): Promise<number> {
    return this.inventoryService.findAllBannersCount(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Get('campaigns')
  findCampaignByBannerId(
    @Query(ValidationPipe) dto: BannerIdDto,
  ): Promise<FindCampaignByBannerIdRes> {
    return this.inventoryService.findCampaignByBannerId(dto.bannerId);
  }
}
