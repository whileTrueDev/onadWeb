import { Controller, Get, Patch, Post } from '@nestjs/common';
import { CampaignService } from './campaign.service';

@Controller('marketer/campaign/analysis')
export class CampaignAnalysisController {
  constructor(private readonly campaignService: CampaignService) {}

  // @Get()
  // @Get('v1/expenditure')
  // @Get('creator-data')
  // @Get('heatmap')
  // @Get('cps')
  // @Get('cps/chart')
  // @Get('cps/creators')
  // @Get('creator-data')
}
