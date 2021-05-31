import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { CampaignAnalysisController } from './campaign-analysis.controller';
import { CampaignAnalysisService } from './campaign-analysis.service';
import { Campaign } from '../../../entities/Campaign';
import { CategoryCampaign } from '../../../entities/CategoryCampaign';
import { CreatorCampaign } from '../../../entities/CreatorCampaign';
import { AfreecaCategory } from '../../../entities/AfreecaCategory';
import { TwitchGame } from '../../../entities/TwitchGame';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Campaign,
      CategoryCampaign,
      CreatorCampaign,
      AfreecaCategory,
      TwitchGame,
    ]),
  ],
  controllers: [CampaignController, CampaignAnalysisController],
  providers: [CampaignService, CampaignAnalysisService],
})
export class CampaignModule {}
