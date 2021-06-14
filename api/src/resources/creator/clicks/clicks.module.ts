import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClicksService } from './clicks.service';
import { ClicksController } from './clicks.controller';
import { TrackingRepository } from '../../../repositories/Tracking.repository';
import { CampaignLogRepository } from '../../../repositories/CampaignLog.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TrackingRepository, CampaignLogRepository])],
  controllers: [ClicksController],
  providers: [ClicksService],
})
export class ClicksModule {}
