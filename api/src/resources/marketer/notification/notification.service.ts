import dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerNotification } from '../../../entities/MarketerNotification';
import { FindMarketerNotificationsRes } from './interfaces/findMarketerNotificationsRes.interface';
import { UpdateMarketerNotificationReadStateDto } from './dto/updateMarketerNotificationReadStateDto.dto';
import { MarketerInfo } from '../../../entities/MarketerInfo';
import { MarketerCharge } from '../../../entities/MarketerCharge';

export interface VBankChargeReadyNotiOptions {
  marketerName: string;
  cashAmount: string;
  vbankName: string;
  vbankNum: string;
}
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(MarketerNotification)
    private readonly marketerNotificationRepo: Repository<MarketerNotification>,
    @InjectRepository(MarketerInfo)
    private readonly marketerInfoRepo: Repository<MarketerInfo>,
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

  // * 광고주 개인알림 생성
  public async createNotification(
    marketerId: string,
    title: string,
    content: string,
  ): Promise<MarketerNotification['index'] | null> {
    const newNoti = this.marketerNotificationRepo.create({ marketerId, title, content });
    const result = await this.marketerNotificationRepo.insert({ ...newNoti });
    if (result.raw.insertId) return result.raw.insertId as MarketerNotification['index'];
    return null;
  }

  // * 가상계좌 발급 개인 알림
  public async vBankChargeReadyNoti(
    marketerId: string,
    vBankChargeReadyNotiOptions: VBankChargeReadyNotiOptions,
  ): Promise<number | null> {
    const { marketerName, cashAmount, vbankName, vbankNum } = vBankChargeReadyNotiOptions;

    const marketer = await this.marketerInfoRepo
      .createQueryBuilder('mC')
      .select(
        'SELECT marketerName, (SELECT FROM_UNIXTIME(?, "%Y-%m-%d 오후 %h시 %i분 %s초")) as duedate',
      )
      .leftJoin(MarketerCharge, 'mC', 'mC.marketerId = :marketerId', { marketerId })
      .where('mC.marketerId = mI.marketerId')
      .getRawOne();

    const title = `${marketerName}님, 가상계좌 발급이 완료되었습니다.`;
    const contents = `${marketerName}님, ${vbankName} ${vbankNum}으로 ${marketer.duedate}까지 ${cashAmount}원을 입금해주세요.`;
    return this.createNotification(marketerId, title, contents);
  }
}
