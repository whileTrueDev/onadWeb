import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AfreecaCategory } from '../../../entities/AfreecaCategory';
import { CampaignLog } from '../../../entities/CampaignLog';
import { TwitchGame } from '../../../entities/TwitchGame';
import { SlackModule } from '../../slack/slack.module';
import { MarketerModule } from '../marketer.module';
import { CampaignAnalysisController } from './campaign-analysis.controller';
import { CampaignAnalysisService } from './campaign-analysis.service';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { CampaignRepository } from './repository/campaign.repository';
import { CategoryCampaignRepository } from './repository/category-campaign.repository';
import { CreatorCampaignRepository } from './repository/creator-campaign.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CampaignRepository,
      CategoryCampaignRepository,
      CreatorCampaignRepository,
      AfreecaCategory,
      TwitchGame,
      CampaignLog,
    ]),
    forwardRef(() => MarketerModule),
    SlackModule,
  ],
  controllers: [CampaignController, CampaignAnalysisController],
  providers: [CampaignService, CampaignAnalysisService],
})
export class CampaignModule {}
