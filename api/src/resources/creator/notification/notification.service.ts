import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorNotification } from '../../../entities/CreatorNotification';
import { FindNotificationsRes } from './interfaces/findNotificationsRes.interface';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(CreatorNotification)
    private readonly creatorNotiRepo: Repository<CreatorNotification>,
  ) {}

  // * 크리에이터 개인알림 목록 정보 조히
  public async findNotifications(creatorId: string): Promise<FindNotificationsRes> {
    const notifications = await this.creatorNotiRepo
      .createQueryBuilder('mn')
      .select('mn.index, title, content, readState')
      .addSelect("date_format(date,'%y년 %m월 %d일') AS dateform")
      .where('creatorId = :creatorId', { creatorId })
      .orderBy('date', 'DESC')
      .addOrderBy('readState', 'ASC')
      .getRawMany();

    const unreadCount = await this.creatorNotiRepo.count({ where: { creatorId, readState: 0 } });
    return {
      unreadCount,
      notifications,
    };
  }

  // * 크리에이터 개인알림 읽음 처리
  public async updateNotification(creatorId: string, targetId: number): Promise<boolean> {
    const result = await this.creatorNotiRepo.update(
      { index: targetId, creatorId },
      { readState: 1 }, // 읽음 = 1
    );
    if (result.affected > 0) return true;
    return false;
  }
}
