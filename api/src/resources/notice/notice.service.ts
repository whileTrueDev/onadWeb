import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorInfo } from '../../entities/CreatorInfo';
import { MarketerInfo } from '../../entities/MarketerInfo';
import { PublicNotice } from '../../entities/PublicNotice';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(PublicNotice) private readonly noticeRepo: Repository<PublicNotice>,
    @InjectRepository(MarketerInfo) private readonly marketerInfoRepo: Repository<MarketerInfo>,
    @InjectRepository(CreatorInfo) private readonly creatorInfoRepo: Repository<CreatorInfo>,
  ) {}

  async findAllNotice(): Promise<PublicNotice[]> {
    const noticeList = await this.noticeRepo
      .createQueryBuilder()
      .orderBy('topic = "필독"', 'DESC')
      .addOrderBy('code', 'DESC')
      .getMany();

    return noticeList.map(notice => ({ ...notice, id: notice.code }));
  }

  async getReadFlag(
    userType: 'creator' | 'marketer',
    targetUserId: string,
  ): Promise<{ noticeReadState: number | boolean }> {
    if (userType === 'marketer') {
      return this.marketerInfoRepo.findOne({
        where: { marketerId: targetUserId },
        select: ['noticeReadState'],
      });
    }

    if (userType === 'creator') {
      return this.creatorInfoRepo.findOne({
        where: { creatorId: targetUserId },
        select: ['noticeReadState'],
      });
    }
    throw new UnauthorizedException();
  }

  async setReadFlag(userType: 'creator' | 'marketer', targetUserId: string): Promise<number> {
    if (userType === 'marketer') {
      const result = await this.marketerInfoRepo
        .createQueryBuilder()
        .update()
        .set({ noticeReadState: 1 })
        .where('marketerId = :marketerId', { marketerId: targetUserId })
        .execute();
      return result.affected;
    }

    if (userType === 'creator') {
      const result = await this.creatorInfoRepo
        .createQueryBuilder()
        .update()
        .set({ noticeReadState: 1 })
        .where('creatorId = :creatorId', { creatorId: targetUserId })
        .execute();
      return result.affected;
    }
    throw new UnauthorizedException();
  }
}
