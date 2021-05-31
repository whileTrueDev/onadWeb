import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, In, QueryRunner, Repository } from 'typeorm';
import { AfreecaCategory } from '../../../entities/AfreecaCategory';
import { Campaign } from '../../../entities/Campaign';
import { CategoryCampaign } from '../../../entities/CategoryCampaign';
import { CreatorCampaign } from '../../../entities/CreatorCampaign';
import { TwitchGame } from '../../../entities/TwitchGame';
import { CreateCampaignDto } from './dto/createCampaignDto.dto';

export enum CampaignPriorityType {
  특정크리에이터송출 = '0',
  특정트위치카테고리송출 = '1',
  특정아프리카카테고리송출 = '1-1',
  무관송출 = '2',
}

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign) private readonly campaignRepo: Repository<Campaign>,
    @InjectRepository(CreatorCampaign)
    private readonly creatorCampaignRepo: Repository<CreatorCampaign>,
    @InjectRepository(CategoryCampaign)
    private readonly categoryCampaignRepo: Repository<CategoryCampaign>,
    @InjectRepository(TwitchGame) private readonly twitchGameRepo: Repository<TwitchGame>,
    @InjectRepository(AfreecaCategory)
    private readonly afreecaCategoryRepo: Repository<AfreecaCategory>,
  ) {}

  // * 개별 캠페인 정보 조회
  findCampaign(campaignId: string): Promise<Campaign> {
    return this.campaignRepo.findOne({
      where: { campaignId, deletedState: 0 },
      order: { onOff: 'DESC', regiDate: 'DESC' },
    });
  }

  // * 캠페인 생성
  async createCampaign(
    marketerId: string,
    marketerName: string,
    dto: CreateCampaignDto,
  ): Promise<Campaign> {
    const lastCampaign = await this.campaignRepo.findOne({
      where: { marketerId },
      order: { regiDate: 'DESC' },
      transaction: false,
    });
    const campaignId = this.getNewCampaignId(marketerId, lastCampaign);

    const targetJsonData = JSON.stringify({ targetList: dto.priorityList });
    const timeJsonData = JSON.stringify({ time: dto.selectedTime });
    const keywordsJsonData = JSON.stringify({ keywords: dto.keyword });

    const campaignObj = this.campaignRepo.create({
      marketerId,
      marketerName,
      campaignId,
      bannerId: dto.bannerId,
      connectedLinkId: dto.connectedLinkId || null,
      merchandiseId: dto.merchandiseId || null,
      campaignName: dto.campaignName,
      campaignDescription: dto.campaignDescription,
      dailyLimit: dto.dailyLimit,
      priorityType: dto.priorityType === '1-1' ? 1 : Number(dto.priorityType),
      optionType: Number(dto.optionType),
      onOff: 0,
      targetList: targetJsonData,
      keyword: keywordsJsonData,
      startDate: dto.startDate,
      finDate: dto.finDate,
      selectedTime: timeJsonData,
    });

    // 트랜잭션 처리
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      await queryRunner.manager.insert(Campaign, campaignObj);
      // 송출 목록 생성
      if (dto.priorityType !== CampaignPriorityType.무관송출) {
        await this.insertCampaignTargets(queryRunner, {
          priorityType: dto.priorityType,
          priorityList: dto.priorityList,
          campaignId,
        });
      }
      await queryRunner.commitTransaction();
      return campaignObj;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(`An error occurred during create campaign (${marketerId}) - `, err);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  updateCampaign() {}

  deleteCampaign() {}

  findCampaignCounts() {}

  findAllCampaigns() {}

  findAllAcitveCampaigns() {}

  findNames() {}

  changeOnOffState() {}

  // **********************************
  // * Private Methods
  // **********************************

  // * 새로운 캠페인 아이디 생성
  private getNewCampaignId(marketerId: string, lastCampaign?: Campaign) {
    if (!lastCampaign) return `${marketerId}_c01`;
    const count = parseInt(lastCampaign.campaignId.split('_c')[1], 10) + 1;
    if (count < 10) return `${marketerId}_c0${count}`;
    return `${marketerId}_c${count}`;
  }

  // * 해당 캠페인의 생성시에 광고 타겟 선택유형에 맞게 DB에 저장
  /**
   * campaign의 priorityType에 따른 광고 송출 정책에 대한 내용을 DB 삽입.
   * (특정 방송인 송출, 특정 Twitch게임, 특정 Afreeca카테고리, 조건무관)
   */
  private async insertCampaignTargets(
    queryRunner: QueryRunner,
    {
      priorityType,
      priorityList,
      campaignId,
    }: { priorityType: '0' | '1' | '1-1' | '2'; priorityList: string[]; campaignId: string },
  ) {
    // * "특정크리에이터송출" 의 경우
    if (priorityType === CampaignPriorityType.특정크리에이터송출) {
      const creatorCampaigns = await this.creatorCampaignRepo.find({
        where: { creatorId: In(priorityList) },
      });

      await Promise.all(
        creatorCampaigns.map(creator => {
          const campaignListJson = JSON.parse(creator.campaignList);
          campaignListJson.campaignList = campaignListJson.campaignList.concat(campaignId);
          return this.updateCreatorCategory(
            JSON.stringify(campaignListJson),
            creator.creatorId,
            queryRunner,
          );
        }),
      );
    }

    // * "특정 카테고리 송출" 의 경우
    // 요청된 카테고리들에 대한 기존 categoryCampaign 데이터 가져오기
    const categoryCampaigns = await this.categoryCampaignRepo.find({
      where: { categoryName: In(priorityList) },
    });
    const needInsertCategories: string[] = []; // 카테고리 송출로 선택된 기록이 없어 Insert 필요한 카테고리
    const needUpdateCategories: CategoryCampaign[] = []; // 이전에 카테고리 송출로 선택된 기록이 있어 Update 필요한 카테고리
    priorityList.forEach(categoryName => {
      const item = categoryCampaigns.find(cc => cc.categoryName === categoryName);
      if (!item) {
        needInsertCategories.push(categoryName);
      } else {
        needUpdateCategories.push(item);
      }
    });

    // * "특정 카테고리 송출" - 아프리카 카테고리 송출 선택 시 + 기존 categoryCampaign 목록에 없는 경우
    if (priorityType === CampaignPriorityType.특정아프리카카테고리송출) {
      // 요청된 카테고리이름들에 대한 categoryId 또는 gameId 가져오기
      const afreecaCategories = await this.afreecaCategoryRepo.find({
        where: { categoryNameKr: In(priorityList) },
      });
      await this.insertCategoryCampaign(
        needInsertCategories.map(categoryName => ({
          categoryId: afreecaCategories.find(x => x.categoryNameKr === categoryName).categoryId,
          categoryName,
          campaignList: JSON.stringify({ campaignList: [campaignId] }),
          state: 0,
          platform: 'afreeca',
          emoji: '',
        })),
        queryRunner,
      );
    }

    // * "특정 카테고리 송출" - 트위치 카테고리 송출 선택 시 + 기존 categoryCampaign 목록에 없는 경우
    if (priorityType === CampaignPriorityType.특정트위치카테고리송출) {
      const twitchCategory = await this.twitchGameRepo.find({
        where: { gameName: In(priorityList) },
      });
      await this.insertCategoryCampaign(
        needInsertCategories.map(categoryName => ({
          categoryId: twitchCategory.find(x => x.gameName === categoryName).gameId,
          categoryName,
          campaignList: JSON.stringify({ campaignList: [campaignId] }),
          state: 0,
          platform: 'twitch',
          emoji: '',
        })),
        queryRunner,
      );
    }

    // * 기존 categoryCampaign 목록에 있는 경우
    await Promise.all(
      needUpdateCategories.map(categoryCampaign => {
        const campaignListJson = JSON.parse(categoryCampaign.campaignList);
        campaignListJson.campaignList = campaignListJson.campaignList.concat(campaignId);
        return this.updateCategoryCampaign(
          JSON.stringify(campaignListJson),
          categoryCampaign.categoryName,
          queryRunner,
        );
      }),
    );
  }

  // * categoryCampaign 데이터 업데이트
  private async updateCreatorCategory(
    newCampaignListJsonString: string,
    creatorId: string,
    queryRunner: QueryRunner,
  ) {
    const result = await this.creatorCampaignRepo
      .createQueryBuilder('creatorcampaign', queryRunner)
      .update()
      .set({ campaignList: newCampaignListJsonString })
      .where('creatorId = :creatorId', { creatorId })
      .execute();
    if (result.affected > 0) return true;
    return false;
  }

  // * categoryCampaign 데이터 삽입
  private async insertCategoryCampaign(categories: CategoryCampaign[], queryRunner: QueryRunner) {
    const result = await this.categoryCampaignRepo
      .createQueryBuilder('categoryCampaign', queryRunner)
      .insert()
      .values(categories)
      .execute();
    if (result.raw) return true;
    return false;
  }

  // * categoryCampaign 데이터 업데이트
  private async updateCategoryCampaign(
    newCampaignListJsonString: string,
    categoryName: string,
    queryRunner: QueryRunner,
  ) {
    const result = await this.categoryCampaignRepo
      .createQueryBuilder('categoryCampaign', queryRunner)
      .update()
      .set({ campaignList: newCampaignListJsonString })
      .where('categoryName = :categoryName', { categoryName })
      .execute();
    if (result.affected > 0) return true;
    return false;
  }
}
