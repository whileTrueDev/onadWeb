import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository, QueryRunner } from 'typeorm';
import { CreatorCampaign } from '../../../../entities/CreatorCampaign';

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
}
