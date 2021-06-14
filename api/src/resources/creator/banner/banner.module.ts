import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { CreatorCampaignRepository } from '../../../repositories/CreatorCampaign.repository';
import { CampaignLogRepository } from '../../../repositories/CampaignLog.repository';
import { CreatorInfoRepository } from '../../../repositories/CreatorInfo.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreatorCampaignRepository,
      CampaignLogRepository,
      CreatorInfoRepository,
    ]),
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
