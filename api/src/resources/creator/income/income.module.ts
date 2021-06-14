import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { CampaignLogRepository } from '../../../repositories/CampaignLog.repository';
import { CreatorWithdrawal } from '../../../entities/CreatorWithdrawal';
import { CreatorIncome } from '../../../entities/CreatorIncome';
import { CreatorInfoRepository } from '../../../repositories/CreatorInfo.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CampaignLogRepository,
      CreatorIncome,
      CreatorWithdrawal,
      CreatorInfoRepository,
    ]),
  ],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}
