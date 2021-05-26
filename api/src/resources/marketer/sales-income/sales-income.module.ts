import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesIncomeService } from './sales-income.service';
import { SalesIncomeController } from './sales-income.controller';
import { MarketerSalesIncome } from '../../../entities/MarketerSalesIncome';

@Module({
  imports: [TypeOrmModule.forFeature([MarketerSalesIncome])],
  controllers: [SalesIncomeController],
  providers: [SalesIncomeService],
})
export class SalesIncomeModule {}
