import dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerNotification } from '../../../entities/MarketerNotification';
import { FindMarketerNotificationsRes } from './interfaces/findMarketerNotificationsRes.interface';
import { UpdateMarketerNotificationReadStateDto } from './dto/updateMarketerNotificationReadStateDto.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(MarketerNotification)
    private readonly marketerNotificationRepo: Repository<MarketerNotification>,
  ) {}

  async findNotifications(marketerId: string): Promise<FindMarketerNotificationsRes> {
    const notifications = await this.marketerNotificationRepo.find({
      where: { marketerId },
      order: { date: 'DESC', readState: 'ASC' },
    });
    let unReadCount = 0;
    notifications.forEach(noti => {
      if (noti.readState === 0) unReadCount += 1;
    });

    return {
      notifications: notifications.map(noti => ({
        ...noti,
        dateform: dayjs(noti.date).format('YY년 MM월 DD일'),
      })),
      unReadCount,
    };
  }

  async updateReadState(
    marketerId: string,
    dto: UpdateMarketerNotificationReadStateDto,
  ): Promise<boolean> {
    const result = await this.marketerNotificationRepo
      .createQueryBuilder()
      .update()
      .set({ readState: 1 })
      .where('marketerNotification.index = :index AND marketerId = :marketerId', {
        index: dto.index,
        marketerId,
      })
      .execute();

    if (result.affected > 0) return true;
    return false;
  }
}
