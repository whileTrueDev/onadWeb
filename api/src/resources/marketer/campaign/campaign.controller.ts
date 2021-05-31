import {
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
import { Marketer } from '../../../decorator/sessionData.decorator';
import { Campaign } from '../../../entities/Campaign';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/createCampaignDto.dto';
import { FindCampaignDto } from './dto/findCampaignDto.dto';

@Controller('marketer/campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  findCampaign(@Query(ValidationPipe) dto: FindCampaignDto): Promise<Campaign> {
    return this.campaignService.findCampaign(dto.campaignId);
  }

  @UseGuards(IsAuthGuard)
  @Post()
  async createCampaign(
    @Marketer() sess: MarketerSession,
    @Body(ValidationPipe) dto: CreateCampaignDto,
  ): Promise<[boolean, string]> {
    const campaign = await this.campaignService.createCampaign(
      sess.marketerId,
      sess.marketerName,
      dto,
    );
    // marketer action log

    // 슬랙알림

    return [true, '캠페인이 생성되었습니다'];
  }

  @UseGuards(IsAuthGuard)
  @Patch()
  updateCampaign() {
    return this.campaignService.updateCampaign();
  }

  @UseGuards(IsAuthGuard)
  @Delete()
  deleteCampaign() {
    return this.campaignService.deleteCampaign();
  }

  @Get('length')
  findCampaignCounts() {
    return this.campaignService.findCampaignCounts();
  }

  @Get('list')
  findAllCampaigns() {
    return this.campaignService.findAllCampaigns();
  }

  @Get('active')
  findAllAcitveCampaigns() {
    return this.campaignService.findAllAcitveCampaigns();
  }

  @Get('names')
  findNames() {
    return this.campaignService.findNames();
  }

  @Patch('on-off')
  changeOnOffState() {
    return this.campaignService.changeOnOffState();
  }
}
