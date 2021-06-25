import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignRepository } from '../repositories/Campaign.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(CampaignRepository) private readonly campaignRepo: CampaignRepository,
  ) {}

  // * 매 일 0시에 캠페인의 limitState를 (한도 초과 아님 상태)0 으로 변경.
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  initCampaignLimitState(): void {
    this.campaignRepo
      .createQueryBuilder()
      .update()
      .set({ limitState: 0 })
      .execute();
  }
}
