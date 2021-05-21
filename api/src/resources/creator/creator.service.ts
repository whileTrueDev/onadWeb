import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AfreecaApiService } from '../../api/afreeca-api/afreeca-api.service';
import { TwitchApiService } from '../../api/twitch-api/twitch-api.service';
import { CreatorInfo } from '../../entities/CreatorInfo';
import { TwitchProfile } from '../../interfaces/TwitchProfile.interface';
import { FindCreatorDto } from './dto/find-creator.dto';

@Injectable()
export class CreatorService {
  constructor(
    @InjectRepository(CreatorInfo) private readonly creatorInfoRepo: Repository<CreatorInfo>,
    private readonly twitchApiService: TwitchApiService,
    private readonly afreecaApiService: AfreecaApiService,
  ) {}

  async findOne({ creatorId, loginId }: FindCreatorDto): Promise<CreatorInfo> {
    return this.creatorInfoRepo.findOne({
      where: [{ creatorId }, { loginId }],
    });
  }

  async findOneByTwitchOriginalId(twitchOriginalId: string): Promise<CreatorInfo> {
    return this.creatorInfoRepo.findOne({ where: { creatorTwitchOriginalId: twitchOriginalId } });
  }

  /**
   * 방송인의 트위치 연동 정보를 최신화합니다. 이 메서드는 TwitchAPI 요청부터 시작합니다.
   * API 요청을 통해 받아온 TwitchProfile 정보가 이미 있다면 `updateTwitchInfoFromTwitchProfile` 함수를 사용하세요.
   * @param user 크리에이터 정보
   * @returns affectedRows
   */
  async updateTwitchInfoWithTwitchAPIRequest(user: CreatorInfo): Promise<'success' | 'fail'> {
    // 트위치 refresh token 가져오기
    const previousRefreshToken = user.creatorTwitchRefreshToken;

    // refresh token으로 access token 생성
    const { access_token: accessToken, refresh_token: refreshToken } =
      await this.twitchApiService.getAccessToken(previousRefreshToken);

    // refresh token으로 user profile 요청
    const userProfile = await this.twitchApiService.getUserProfile(accessToken, user.creatorId);

    // 변경사항이 있는제 치크하여 유저 정보 업데이트
    const affectedRows = await this.updateTwitchInfoFromTwitchProfile(
      user.creatorId,
      refreshToken,
      userProfile,
    );
    if (affectedRows > 0) return 'success';
    return 'fail';
  }

  /**
   * 방송인의 트위치 연동 정보를 최신화합니다.
   * @param creatorId 크리에이터 아이디
   * @param refreshToken 리프레시토큰
   * @param profile 트위치 API 요청을 통해 받은 유저프로필 정보
   * @returns affectedRows
   */
  async updateTwitchInfoFromTwitchProfile(
    creatorId: string,
    refreshToken: string,
    profile: TwitchProfile,
  ): Promise<number> {
    const result = await this.creatorInfoRepo
      .createQueryBuilder()
      .update(CreatorInfo)
      .set({
        creatorTwitchOriginalId: profile.id,
        creatorName: profile.display_name,
        creatorTwitchId: profile.login,
        creatorMail: profile.email,
        creatorLogo: profile.profile_image_url,
        creatorTwitchRefreshToken: refreshToken,
      })
      .where('creatorId = :creatorId', { creatorId })
      .execute();
    return result.affected;
  }

  /**
   * 아프리카 연동 정보 최신화
   * @param user CreatorInfo
   * @returns 'success' | 'fail'
   */
  async updateAfreecaInfo(user: CreatorInfo): Promise<'success' | 'fail'> {
    // 아프리카 정보 가져오기
    const { nickname, logo } = await this.afreecaApiService.getUserProfile(user.afreecaId);
    // 변경사항이 있는제 치크하여 유저 정보 업데이트
    const result = await this.creatorInfoRepo
      .createQueryBuilder()
      .update(CreatorInfo)
      .set({ afreecaName: nickname, afreecaLogo: logo })
      .where('creatorId = :creatorId', { creatorId: user.creatorId })
      .execute();

    if (result.affected > 0) return 'success';
    return 'fail';
  }

  /**
   * 크리에이터(방송인)의 트위치 리프레시토큰을 변경
   * @param creatorId 크리에이터 아이디
   * @param refreshToken 변경할 리프레시 토큰
   * @returns affected rows
   */
  async replaceTwitchRefreshToken(
    creatorId: CreatorInfo['creatorId'],
    refreshToken: string,
  ): Promise<number> {
    const result = await this.creatorInfoRepo
      .createQueryBuilder()
      .update(CreatorInfo)
      .set({ creatorTwitchRefreshToken: refreshToken })
      .where('creatorId = :creatorId', { creatorId })
      .execute();

    return result.affected;
  }
}
