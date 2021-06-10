import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AfreecaCategory } from '../../../entities/AfreecaCategory';
import { TwitchGame } from '../../../entities/TwitchGame';
import { CampaignRepository } from '../../../repositories/Campaign.repository';
import { CampaignLogRepository } from '../../../repositories/CampaignLog.repository';
import { CategoryCampaignRepository } from '../../../repositories/CategoryCampaign.repository';
import { CreatorCampaignRepository } from '../../../repositories/CreatorCampaign.repository';
import { TrackingRepository } from '../../../repositories/Tracking.repository';
import { SlackModule } from '../../slack/slack.module';
import { MarketerModule } from '../marketer.module';
import { CampaignAnalysisController } from './campaign-analysis.controller';
import { CampaignAnalysisService } from './campaign-analysis.service';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CampaignRepository,
      CategoryCampaignRepository,
      CreatorCampaignRepository,
      AfreecaCategory,
      TwitchGame,
      CampaignLogRepository,
      TrackingRepository,
    ]),
    forwardRef(() => MarketerModule),
    SlackModule,
  ],
  controllers: [CampaignController, CampaignAnalysisController],
  providers: [CampaignService, CampaignAnalysisService],
})
export class CampaignModule {}
