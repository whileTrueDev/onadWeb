import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository, QueryRunner } from 'typeorm';
import { CreatorCampaign } from '../entities/CreatorCampaign';

@Injectable()
@EntityRepository(CreatorCampaign)
export class CreatorCampaignRepository extends Repository<CreatorCampaign> {
  // * categoryCampaign 데이터 업데이트
  public async updateCreatorCategory(
    newCampaignListJsonString: string,
    creatorId: string,
    queryRunner: QueryRunner,
  ): Promise<boolean> {
    const result = await this.createQueryBuilder('creatorcampaign', queryRunner)
      .update()
      .set({ campaignList: newCampaignListJsonString })
      .where('creatorId = :creatorId', { creatorId })
      .execute();
    if (result.affected > 0) return true;
    return false;
  }

  // * 해당 크리에이터의 creatorCampaign 초기값 생성
  public new(creatorId: string): CreatorCampaign {
    const emptyList = JSON.stringify({ campaignList: [] });
    const newOne = this.create({
      creatorId,
      campaignList: emptyList,
      banList: emptyList,
      pausedList: emptyList,
    });

    return newOne;
  }

  // * pausedList 조회
  public async __getPausedCampaignList(creatorId: string): Promise<string[]> {
    const pausedListResult = await this.findOne({
      where: { creatorId },
    });
    return JSON.parse(pausedListResult.pausedList).campaignList;
  }
}
