import { Controller, UseGuards, Get, Patch, Body, ParseIntPipe } from '@nestjs/common';
import { Creator } from '../../../decorators/sessionData.decorator';
import { CreatorSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { FindNotificationsRes } from './interfaces/findNotificationsRes.interface';
import { NotificationService } from './notification.service';

@UseGuards(IsAuthGuard)
@Controller('creator/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findNotifications(@Creator() { creatorId }: CreatorSession): Promise<FindNotificationsRes> {
    return this.notificationService.findNotifications(creatorId);
  }

  @Patch()
  updateNotification(
    @Creator() { creatorId }: CreatorSession,
    @Body('index', ParseIntPipe) targetId: number,
  ): Promise<boolean> {
    return this.notificationService.updateNotification(creatorId, targetId);
  }
}
