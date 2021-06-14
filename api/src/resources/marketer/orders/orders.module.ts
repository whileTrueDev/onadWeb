import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchandiseMallItems } from '../../../entities/MerchandiseMallItems';
import { MerchandiseOrderRelease } from '../../../entities/MerchandiseOrderRelease';
import { MerchandiseOrders } from '../../../entities/MerchandiseOrders';
import { MerchandiseRegistered } from '../../../entities/MerchandiseRegistered';
import { SlackModule } from '../../slack/slack.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MerchandiseOrderRelease,
      MerchandiseMallItems,
      MerchandiseRegistered,
      MerchandiseOrders,
    ]),
    SlackModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
