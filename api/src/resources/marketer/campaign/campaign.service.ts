import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, In, QueryRunner, Repository } from 'typeorm';
import { PaginationDto } from '../../../dto/paginationDto.dto';
import { AfreecaCategory } from '../../../entities/AfreecaCategory';
import { Campaign } from '../../../entities/Campaign';
import { CategoryCampaign } from '../../../entities/CategoryCampaign';
import { TwitchGame } from '../../../entities/TwitchGame';
import { ChangeCampaignOnOffStateDto } from './dto/changeCampaignOnOffStateDto.dto';
import { CreateCampaignDto } from './dto/createCampaignDto.dto';
import { CampaignPriorityType } from './interfaces/campaignPriorityType.enum';
import { FindActiveCampaignCountsRes } from './interfaces/findActiveCampaignCountsRes.interface';
import { FindCampaignRes } from './interfaces/findCampaignRes.interface';
import { CampaignRepository } from '../../../repositories/Campaign.repository';
import { CategoryCampaignRepository } from '../../../repositories/CategoryCampaign.repository';
import { CreatorCampaignRepository } from '../../../repositories/CreatorCampaign.repository';
import { transactionQuery } from '../../../utils/transactionQuery';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(CampaignRepository) private readonly campaignRepo: CampaignRepository,
    @InjectRepository(CreatorCampaignRepository)
    private readonly creatorCampaignRepo: CreatorCampaignRepository,
    @InjectRepository(CategoryCampaignRepository)
    private readonly categoryCampaignRepo: CategoryCampaignRepository,
    @InjectRepository(TwitchGame) private readonly twitchGameRepo: Repository<TwitchGame>,
    @InjectRepository(AfreecaCategory)
    private readonly afreecaCategoryRepo: Repository<AfreecaCategory>,
  ) {}

  // * 개별 캠페인 정보 조회
  findCampaign(campaignId: string): Promise<FindCampaignRes> {
    return this.campaignRepo.findOneCampaign(campaignId);
  }

  // * 캠페인 목록 조회
  async findAllCampaigns(marketerId: string, dto: PaginationDto): Promise<FindCampaignRes[]> {
    const searchPage = Math.round(Number(dto.page > 0 ? dto.page : 0) * Number(dto.offset));
    const searchOffset = Number(dto.offset);
    return this.campaignRepo.findAllCampaigns(marketerId, searchPage, searchOffset);
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
    const connection = getConnection();
    return transactionQuery(
      connection,
      async queryRunner => {
        await queryRunner.manager.insert(Campaign, campaignObj);
        // 송출 목록 생성
        if (dto.priorityType !== CampaignPriorityType.무관송출) {
          await this.insertCampaignTargets(queryRunner, {
            priorityType: dto.priorityType,
            priorityList: dto.priorityList,
            campaignId,
          });
        }
        return campaignObj;
      },
      { errorMessage: `An error occurred during create campaign (${marketerId}) - ` },
    );
  }

  // * 캠페인 정보 수정 - 캠페인 이름 수정
  async updateCampaignName(
    marketerId: string,
    campaignId: string,
    newName: string,
  ): Promise<boolean> {
    return this.campaignRepo.updateCampaignName(marketerId, campaignId, newName);
  }

  // * 캠페인 정보 수정 - 캠페인 일일 예산 수정
  async updateCampaignBudget(
    marketerId: string,
    campaignId: string,
    newBudget: number,
  ): Promise<boolean> {
    const todayAmount = await this.campaignRepo.findCampaignUsageToday(marketerId, campaignId);

    // 본인 데이터가 아닌 경우
    if (todayAmount.limitState === null && todayAmount.count === null) return false;

    if (todayAmount.count >= newBudget) {
      if (todayAmount.limitState === 1) {
        // 현재까지 사용한 광고 금액이 바꿀 예산보다 큰 경우
        // ex) 기존 설정 값 (30,000) → 변경 값 (50,000)이고, 현재 30,000을 사용
        // 예산 변경 적용, limitState를 1 -> 0으로 변경
        return this.campaignRepo.updateCampaignBudget({ campaignId, newBudget, limitState: 0 });
      }
      // 현재까지 사용한 광고 금액이 바꿀 예산보다 큰 경우
      // ex) 기존 설정 값 (30,000) → 변경 값 (20,000)이고, 현재 20,001원을 사용
      return this.campaignRepo.updateCampaignBudget({ campaignId, newBudget, limitState: 1 });
    }
    // 현재 사용한 금액이 바꿀 예산보다 작은 경우
    // ex) 기존 설정 값 (30,000) → 변경 값 (20,000)이고, 현재 10,000원을 사용
    // ex) 기존 설정 값 (30,000) → 변경 값 (50,000)이고, 현재 20,000원을 사용
    return this.campaignRepo.updateCampaignBudget({ campaignId, newBudget, limitState: 0 });
  }

  // * 캠페인 삭제
  async deleteCampaign(marketerId: string, campaignId: string): Promise<boolean | Campaign> {
    return this.campaignRepo.deleteCampaign(marketerId, campaignId);
  }

  // * 캠페인 목록의 총 길이를 반환
  findCampaignCounts(marketerId: string): Promise<number> {
    return this.campaignRepo.count({ where: { marketerId, deletedState: 0 } });
  }

  // * 해당 광고주의 켜져있는 캠페인 수를 반환
  async findActiveCampaignCounts(marketerId: string): Promise<FindActiveCampaignCountsRes> {
    const activeCampaignCount = await this.campaignRepo.count({ where: { onOff: 1, marketerId } });
    return { activeCampaignCount };
  }

  // * 캠페인 이름 목록 반환 - 캠페인 이름 중복 확인을 위해
  async findNames(): Promise<string[]> {
    const result = await this.campaignRepo.find({ select: ['campaignName'] });
    return result.map(c => c.campaignName);
  }

  // * 캠페인 On/Off
  async changeOnOffState(
    marketerId: string,
    dto: ChangeCampaignOnOffStateDto,
  ): Promise<[boolean, string?]> {
    const { bannerConfirm, linkConfirm } = await this.campaignRepo.findCampaignOnOffDetail(
      dto.campaignId,
    );
    if (
      (bannerConfirm === 1 && linkConfirm === 1) ||
      (bannerConfirm === 1 && linkConfirm === null)
    ) {
      const result = await this.campaignRepo.updateCampaignOnOff(
        marketerId,
        dto.campaignId,
        dto.onoffState,
      );
      return [result];
    }
    if (bannerConfirm === 1) {
      return [false, 'URL에 대한 승인이 완료되지 않았습니다.'];
    }
    if (linkConfirm === 1) {
      return [false, '배너에 대한 승인이 완료되지 않았습니다.'];
    }
    return [false, '배너, URL에 대한 승인이 완료되지 않았습니다.'];
  }

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
          return this.creatorCampaignRepo.updateCreatorCategory(
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
      await this.categoryCampaignRepo.insertCategoryCampaign(
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
      await this.categoryCampaignRepo.insertCategoryCampaign(
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
        return this.categoryCampaignRepo.updateCategoryCampaign(
          JSON.stringify(campaignListJson),
          categoryCampaign.categoryName,
          queryRunner,
        );
      }),
    );
  }
}
