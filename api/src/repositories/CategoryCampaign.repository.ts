import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository, QueryRunner } from 'typeorm';
import { CategoryCampaign } from '../entities/CategoryCampaign';

@Injectable()
@EntityRepository(CategoryCampaign)
export class CategoryCampaignRepository extends Repository<CategoryCampaign> {
  // * categoryCampaign 데이터 삽입
  public async insertCategoryCampaign(
    categories: CategoryCampaign[],
    queryRunner: QueryRunner,
  ): Promise<boolean> {
    const result = await this.createQueryBuilder('categoryCampaign', queryRunner)
      .insert()
      .values(categories)
      .execute();
    if (result.raw) return true;
    return false;
  }

  // * categoryCampaign 데이터 업데이트
  public async updateCategoryCampaign(
    newCampaignListJsonString: string,
    categoryName: string,
    queryRunner: QueryRunner,
  ): Promise<boolean> {
    const result = await this.createQueryBuilder('categoryCampaign', queryRunner)
      .update()
      .set({ campaignList: newCampaignListJsonString })
      .where('categoryName = :categoryName', { categoryName })
      .execute();
    if (result.affected > 0) return true;
    return false;
  }
}
