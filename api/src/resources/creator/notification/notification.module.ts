import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { CreatorNotification } from '../../../entities/CreatorNotification';

@Module({
  imports: [TypeOrmModule.forFeature([CreatorNotification])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
