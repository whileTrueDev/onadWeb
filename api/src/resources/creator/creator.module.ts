import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AfreecaApiModule } from '../../api/afreeca-api/afreeca-api.module';
import { TwitchApiModule } from '../../api/twitch-api/twitch-api.module';
import { CreatorIncome } from '../../entities/CreatorIncome';
import { CreatorPrice } from '../../entities/CreatorPrice';
import { CreatorReferralCode } from '../../entities/CreatorReferralCode';
import { CreatorReferralCodeLogs } from '../../entities/CreatorReferralCodeLogs';
import { CreatorRoyaltyLevel } from '../../entities/CreatorRoyaltyLevel';
import { CreatorCampaignRepository } from '../../repositories/CreatorCampaign.repository';
import { CreatorInfoRepository } from '../../repositories/CreatorInfo.repository';
import { SlackModule } from '../slack/slack.module';
import { CreatorController } from './creator.controller';
import { CreatorService } from './creator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreatorInfoRepository,
      CreatorCampaignRepository,
      CreatorReferralCode,
      CreatorReferralCodeLogs,
      CreatorIncome,
      CreatorPrice,
      CreatorRoyaltyLevel,
    ]),
    TwitchApiModule,
    AfreecaApiModule,
    SlackModule,
  ],
  controllers: [CreatorController],
  providers: [CreatorService],
  exports: [CreatorService],
})
export class CreatorModule {}
