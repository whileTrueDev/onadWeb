import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketerService } from './marketer.service';
import { MarketerController } from './marketer.controller';
import { MarketerInfo } from '../../entities/MarketerInfo';
import { MailModule } from '../mail/mail.module';
import { MarketerDebit } from '../../entities/MarketerDebit';
import { MarketerSalesIncome } from '../../entities/MarketerSalesIncome';
import { AccountModule } from './account/account.module';
import { BusinessModule } from './business/business.module';
import { TaxBillsModule } from './tax-bills/tax-bills.module';
import { NotificationModule } from './notification/notification.module';
import { ProfileImageModule } from './profile-image/profile-image.module';
import { SettlementModule } from './settlement/settlement.module';
import { SalesIncomeModule } from './sales-income/sales-income.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarketerInfo, MarketerDebit, MarketerSalesIncome]),
    MailModule,
    AccountModule,
    BusinessModule,
    TaxBillsModule,
    NotificationModule,
    ProfileImageModule,
    SettlementModule,
    SalesIncomeModule,
    OrdersModule,
  ],
  controllers: [MarketerController],
  providers: [MarketerService],
  exports: [MarketerService],
})
export class MarketerModule {}
