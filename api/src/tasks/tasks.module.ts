import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignRepository } from '../repositories/Campaign.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignRepository])],
  providers: [TasksService],
})
export class TasksModule {}
