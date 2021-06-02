import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashService } from './cash.service';
import { CashController } from './cash.controller';
import { MarketerDebit } from '../../../entities/MarketerDebit';
import { MarketerCharge } from '../../../entities/MarketerCharge';

@Module({
  imports: [TypeOrmModule.forFeature([MarketerDebit, MarketerCharge])],
  controllers: [CashController],
  providers: [CashService],
})
export class CashModule {}
