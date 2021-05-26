import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MerchandiseOrders } from '../../../entities/MerchandiseOrders';
import { MerchandiseOrderRelease } from '../../../entities/MerchandiseOrderRelease';
import { SlackModule } from '../../slack/slack.module';
import { MerchandiseMallItems } from '../../../entities/MerchandiseMallItems';

@Module({
  imports: [
    TypeOrmModule.forFeature([MerchandiseOrders, MerchandiseOrderRelease, MerchandiseMallItems]),
    SlackModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
