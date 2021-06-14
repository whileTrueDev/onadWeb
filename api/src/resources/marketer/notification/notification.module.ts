import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MarketerNotification } from '../../../entities/MarketerNotification';
import { MarketerInfo } from '../../../entities/MarketerInfo';

@Module({
  imports: [TypeOrmModule.forFeature([MarketerNotification, MarketerInfo])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
