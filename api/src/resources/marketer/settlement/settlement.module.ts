import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementService } from './settlement.service';
import { SettlementController } from './settlement.controller';
import { MarketerSettlement } from '../../../entities/MarketerSettlement';
import { SlackModule } from '../../slack/slack.module';
import { SettlementLogsService } from './settlement-logs.service';
import { MarketerSalesIncomeSettlementLogs } from '../../../entities/MarketerSalesIncomeSettlementLogs';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarketerSettlement, MarketerSalesIncomeSettlementLogs]),
    SlackModule,
  ],
  controllers: [SettlementController],
  providers: [SettlementService, SettlementLogsService],
})
export class SettlementModule {}
