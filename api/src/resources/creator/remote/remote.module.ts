import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorCampaignRepository } from '../../../repositories/CreatorCampaign.repository';
import { CreatorInfoRepository } from '../../../repositories/CreatorInfo.repository';
import { RemoteController } from './remote.controller';
import { RemoteService } from './remote.service';

@Module({
  imports: [TypeOrmModule.forFeature([CreatorInfoRepository, CreatorCampaignRepository])],
  controllers: [RemoteController],
  providers: [RemoteService],
})
export class RemoteModule {}
