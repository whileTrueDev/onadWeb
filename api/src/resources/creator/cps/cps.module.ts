import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CpsService } from './cps.service';
import { CpsController } from './cps.controller';
import { CampaignLogRepository } from '../../../repositories/CampaignLog.repository';
import { MerchandiseOrderComments } from '../../../entities/MerchandiseOrderComments';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignLogRepository, MerchandiseOrderComments])],
  controllers: [CpsController],
  providers: [CpsService],
})
export class CpsModule {}
