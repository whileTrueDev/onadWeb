import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MarketerNotification } from '../../../entities/MarketerNotification';

@Module({
  imports: [TypeOrmModule.forFeature([MarketerNotification])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
