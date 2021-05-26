import { Body, Controller, Get, Patch, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { UpdateMarketerNotificationReadStateDto } from './dto/updateMarketerNotificationReadStateDto.dto';
import { FindMarketerNotificationsRes } from './interfaces/findMarketerNotificationsRes.interface';
import { NotificationService } from './notification.service';

@Controller('marketer/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(IsAuthGuard)
  @Get()
  findNotifications(@Req() req: Request): Promise<FindMarketerNotificationsRes> {
    return this.notificationService.findNotifications(req.user.marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Patch()
  updateReadState(
    @Req() req: Request,
    @Body(ValidationPipe) dto: UpdateMarketerNotificationReadStateDto,
  ): Promise<boolean> {
    return this.notificationService.updateReadState(req.user.marketerId, dto);
  }
}
