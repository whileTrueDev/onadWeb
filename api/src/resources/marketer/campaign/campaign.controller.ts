import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Marketer } from '../../../decorators/sessionData.decorator';
import { PaginationDto } from '../../../dto/paginationDto.dto';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { SlackService } from '../../slack/slack.service';
import { MarketerActionLogService, MarketerActionLogType } from '../marketerActionLog.service';
import { CampaignService } from './campaign.service';
import { ChangeCampaignOnOffStateDto } from './dto/changeCampaignOnOffStateDto.dto';
import { CreateCampaignDto } from './dto/createCampaignDto.dto';
import { DeleteCampaignDto } from './dto/deleteCampaignDto.dto';
import { FindCampaignDto } from './dto/findCampaignDto.dto';
import { UpdateCampaignDto } from './dto/updateCampaignDto.dto';
import { FindActiveCampaignCountsRes } from './interfaces/findActiveCampaignCountsRes.interface';
import { FindCampaignRes } from './interfaces/findCampaignRes.interface';

@Controller('marketer/campaign')
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly marketerLogService: MarketerActionLogService,
    private readonly slackService: SlackService,
  ) {}

  @Get()
  findCampaign(@Query(ValidationPipe) dto: FindCampaignDto): Promise<FindCampaignRes> {
    return this.campaignService.findCampaign(dto.campaignId);
  }

  @UseGuards(IsAuthGuard)
  @Post()
  async createCampaign(
    @Marketer() sess: MarketerSession,
    @Body(ValidationPipe) dto: CreateCampaignDto,
  ): Promise<[boolean, string]> {
    console.log(dto);
    const campaign = await this.campaignService.createCampaign(
      sess.marketerId,
      sess.marketerName,
      dto,
    );
    if (campaign) {
      // marketer action log
      this.marketerLogService.createLog(
        sess.marketerId,
        MarketerActionLogType.캠페인생성,
        JSON.stringify({ campaignName: campaign.campaignName }),
      );
      // 슬랙알림
      this.slackService.jsonMessage({
        summary: '캠페인 등록 알림',
        text: '관리자 페이지에서 방금 등록된 캠페인을 확인하세요.',
        fields: [
          { title: '마케터 이름', value: campaign.marketerName, short: true },
          { title: '캠페인 이름', value: campaign.campaignName, short: true },
        ],
      });
    }
    return [true, '캠페인이 생성되었습니다'];
  }

  @UseGuards(IsAuthGuard)
  @Patch()
  updateCampaign(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: UpdateCampaignDto,
  ): Promise<boolean> {
    if (dto.type === 'name') {
      return this.campaignService.updateCampaignName(
        marketerId,
        dto.campaignId,
        dto.data.campaignName,
      );
    }
    if (dto.type === 'budget') {
      return this.campaignService.updateCampaignBudget(
        marketerId,
        dto.campaignId,
        dto.data.noBudget ? -1 : Number(dto.data.budget),
      );
    }
    throw new BadRequestException();
  }

  @UseGuards(IsAuthGuard)
  @Delete()
  async deleteCampaign(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: DeleteCampaignDto,
  ): Promise<boolean> {
    const campaign = await this.campaignService.deleteCampaign(marketerId, dto.campaignId);
    if (campaign && typeof campaign !== 'boolean') {
      this.marketerLogService.createLog(
        marketerId,
        MarketerActionLogType.캠페인삭제,
        JSON.stringify({ campaignName: campaign.campaignName }),
      );
      return true;
    }
    return false;
  }

  @UseGuards(IsAuthGuard)
  @Get('length')
  findCampaignCounts(@Marketer() { marketerId }: MarketerSession): Promise<number> {
    return this.campaignService.findCampaignCounts(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Get('list')
  findAllCampaigns(
    @Marketer() { marketerId }: MarketerSession,
    @Query(ValidationPipe) dto: PaginationDto,
  ): Promise<FindCampaignRes[]> {
    return this.campaignService.findAllCampaigns(marketerId, dto);
  }

  @UseGuards(IsAuthGuard)
  @Get('active')
  findAllAcitveCampaigns(
    @Marketer() { marketerId }: MarketerSession,
  ): Promise<FindActiveCampaignCountsRes> {
    return this.campaignService.findActiveCampaignCounts(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Get('names')
  findNames(): Promise<string[]> {
    return this.campaignService.findNames();
  }

  @UseGuards(IsAuthGuard)
  @Patch('on-off')
  changeOnOffState(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: ChangeCampaignOnOffStateDto,
  ): Promise<[boolean, string?]> {
    return this.campaignService.changeOnOffState(marketerId, dto);
  }
}
