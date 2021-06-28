import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketerSalesIncomeSettlementLogs } from '../../../entities/MarketerSalesIncomeSettlementLogs';
import { MarketerSettlement } from '../../../entities/MarketerSettlement';
import { MerchandiseOrdersDetailRepository } from '../../../repositories/MerchandiseOrdersDetail.repository';
import { SlackModule } from '../../slack/slack.module';
import { SettlementLogsService } from './settlement-logs.service';
import { SettlementController } from './settlement.controller';
import { SettlementService } from './settlement.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MarketerSettlement,
      MarketerSalesIncomeSettlementLogs,
      MerchandiseOrdersDetailRepository,
    ]),
    SlackModule,
  ],
  controllers: [SettlementController],
  providers: [SettlementService, SettlementLogsService],
})
export class SettlementModule {}
