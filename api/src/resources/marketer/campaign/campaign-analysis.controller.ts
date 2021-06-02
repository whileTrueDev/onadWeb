import { Controller, Get, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { Marketer } from '../../../decorators/sessionData.decorator';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { CampaignAnalysisService } from './campaign-analysis.service';
import { CampaignIdDto } from './dto/campaignIdDto.dto';
import { FindAnalysisDataRes } from './interfaces/findAnalysisDataRes.interface';
import { FindCpsAnalysisDataRes } from './interfaces/findCpsAnalysisDataRes.interface';
import { FindCpsExpenditureDataRes } from './interfaces/findCpsExpenditureDataRes.interface';
import {
  FindCreatorDataByCampaignRes,
  FindCreatorDataCpsRes,
  FindCreatorDataRes,
} from './interfaces/findCreatorDataRes.interface';
import { FindExpenditureDataRes } from './interfaces/findExpenditureDataRes.interface';
import { FindHeatmapDataRes } from './interfaces/FindHeatmapDataRes.interface';

@Controller('marketer/campaign/analysis')
export class CampaignAnalysisController {
  constructor(private readonly campaignAnalysisService: CampaignAnalysisService) {}

  @UseGuards(IsAuthGuard)
  @Get()
  findAnalysisData(): Promise<FindAnalysisDataRes> {
    return this.campaignAnalysisService.findAnalysisData('gubgoo_c02');
  }

  @UseGuards(IsAuthGuard)
  @Get('v1/expenditure')
  findExpenditureChartData(
    @Query(ValidationPipe) dto: CampaignIdDto,
  ): Promise<FindExpenditureDataRes[]> {
    return this.campaignAnalysisService.findExpenditureChartData(dto.campaignId);
  }

  @UseGuards(IsAuthGuard)
  @Get('creator-data')
  findCreatorData(
    @Marketer() { marketerId }: MarketerSession,
    @Query('campaignId') campaignId: string,
  ): Promise<FindCreatorDataByCampaignRes | FindCreatorDataRes> {
    if (campaignId) {
      return this.campaignAnalysisService.findCreatorDataByCampaign(campaignId);
    }
    return this.campaignAnalysisService.findCreatorData(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Get('heatmap')
  findHeatmapData(
    @Query('campaignId') campaignId: string,
    @Query(ValidationPipe) dto: CampaignIdDto,
  ): Promise<FindHeatmapDataRes> {
    return this.campaignAnalysisService.findHeatmapData(dto.campaignId);
  }

  // *******************************
  // * CPS 데이터
  // *******************************
  @UseGuards(IsAuthGuard)
  @Get('cps')
  findCpsAnalysisData(@Query(ValidationPipe) dto: CampaignIdDto): Promise<FindCpsAnalysisDataRes> {
    return this.campaignAnalysisService.findCpsAnalysisData(dto.campaignId);
  }

  @UseGuards(IsAuthGuard)
  @Get('cps/chart')
  findCpsExpenditureChartData(
    @Query(ValidationPipe) dto: CampaignIdDto,
  ): Promise<FindCpsExpenditureDataRes> {
    return this.campaignAnalysisService.findCpsExpenditureChartData(dto.campaignId);
  }

  @UseGuards(IsAuthGuard)
  @Get('cps/creators')
  findCpsCreators(@Query(ValidationPipe) dto: CampaignIdDto): Promise<FindCreatorDataCpsRes> {
    return this.campaignAnalysisService.findCpsCreators(dto.campaignId);
  }
}
