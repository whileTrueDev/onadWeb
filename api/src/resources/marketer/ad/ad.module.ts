import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';
import { MarketerInfo } from '../../../entities/MarketerInfo';
import { CampaignLog } from '../../../entities/CampaignLog';
import { Tracking } from '../../../entities/Tracking';

@Module({
  imports: [TypeOrmModule.forFeature([MarketerInfo, CampaignLog, Tracking])],
  controllers: [AdController],
  providers: [AdService],
})
export class AdModule {}
