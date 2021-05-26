import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketerTaxBill } from '../../../entities/MarketerTaxBill';
import { TaxBillsController } from './tax-bills.controller';
import { TaxBillsService } from './tax-bills.service';

@Module({
  imports: [TypeOrmModule.forFeature([MarketerTaxBill])],
  controllers: [TaxBillsController],
  providers: [TaxBillsService],
})
export class TaxBillsModule {}
