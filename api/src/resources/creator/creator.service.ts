import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AfreecaApiService } from '../../api/afreeca-api/afreeca-api.service';
import { TwitchApiService } from '../../api/twitch-api/twitch-api.service';
import { CreatorInfo } from '../../entities/CreatorInfo';
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

  // 트위치 연동정보 최신화
  async updateTwitchInfo(user: CreatorInfo): Promise<string> {
    // 트위치 refresh token 가져오기
    const previousRefreshToken = user.creatorTwitchRefreshToken;

    // refresh token으로 access token 생성
    const { access_token: accessToken, refresh_token: refreshToken } =
      await this.twitchApiService.getAccessToken(previousRefreshToken);

    // refresh token으로 user profile 요청
    const userProfile = await this.twitchApiService.getUserProfile(accessToken, user.creatorId);

    // 변경사항이 있는제 치크하여 유저 정보 업데이트
    const result = await this.creatorInfoRepo
      .createQueryBuilder()
      .update(CreatorInfo)
      .set({
        creatorName: userProfile.display_name,
        creatorTwitchId: userProfile.login,
        creatorMail: userProfile.email,
        creatorLogo: userProfile.profile_image_url,
        creatorTwitchRefreshToken: refreshToken,
      })
      .where('creatorId = :creatorId', { creatorId: user.creatorId })
      .execute();

    if (result.affected > 0) return 'success';
    return 'fail';
  }

  // 아프리카 연동 정보 최신화
  async updateAfreecaInfo(user: CreatorInfo): Promise<any> {
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
}
