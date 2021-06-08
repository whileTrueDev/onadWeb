import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamportModule } from '../../../api/iamport/iamport.module';
import { MarketerCharge } from '../../../entities/MarketerCharge';
import { MarketerDebit } from '../../../entities/MarketerDebit';
import { MarketerRefund } from '../../../entities/MarketerRefund';
import { CampaignLogRepository } from '../../../repositories/CampaignLog.repository';
import { SlackModule } from '../../slack/slack.module';
import { MarketerModule } from '../marketer.module';
import { NotificationModule } from '../notification/notification.module';
import { CashHistoryService } from './cash-history.service';
import { CashController } from './cash.controller';
import { CashService } from './cash.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MarketerDebit,
      MarketerCharge,
      MarketerRefund,
      CampaignLogRepository,
    ]),
    IamportModule,
    SlackModule,
    NotificationModule,
    forwardRef(() => MarketerModule),
  ],
  controllers: [CashController],
  providers: [CashHistoryService, CashService],
})
export class CashModule {}
