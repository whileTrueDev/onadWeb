import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { Connection, IsNull, Not, Repository } from 'typeorm';
import { AfreecaApiService } from '../../api/afreeca-api/afreeca-api.service';
import { TwitchApiService } from '../../api/twitch-api/twitch-api.service';
import { CreatorCampaign } from '../../entities/CreatorCampaign';
import { CreatorIncome } from '../../entities/CreatorIncome';
import { CreatorInfo } from '../../entities/CreatorInfo';
import { CreatorPrice } from '../../entities/CreatorPrice';
import { CreatorReferralCode } from '../../entities/CreatorReferralCode';
import { CreatorReferralCodeLogs } from '../../entities/CreatorReferralCodeLogs';
import { CreatorRoyaltyLevel } from '../../entities/CreatorRoyaltyLevel';
import { TwitchProfile } from '../../interfaces/TwitchProfile.interface';
import { CreatorCampaignRepository } from '../../repositories/CreatorCampaign.repository';
import { CreatorInfoRepository } from '../../repositories/CreatorInfo.repository';
import encrypto from '../../utils/encryption';
import { transactionQuery } from '../../utils/transactionQuery';
import { CreateCreatorDto } from './dto/createCreatorDto.dto';
import { CreateCreatorPreUserDto } from './dto/createCreatorPreUserDto.dto';
import { FindCreatorDto } from './dto/findCreator.dto';
import { UpdateCreatorInfoDto } from './dto/updateCreatorInfoDto.dto';
import { UpdateCreatorSettlementInfoDto } from './dto/updateCreatorSettlementInfoDto.dto';

@Injectable()
export class CreatorService {
  CREATOR_LANDING_URL_TWITCH_PREFIX = 'https://t.onad.io/';
  CREATOR_LANDING_URL_AFREECA_PREFIX = 'https://t.onad.io/afreeca/';

  constructor(
    private readonly connection: Connection,
    private readonly twitchApiService: TwitchApiService,
    private readonly afreecaApiService: AfreecaApiService,
    @InjectRepository(CreatorInfoRepository)
    private readonly creatorInfoRepo: CreatorInfoRepository,
    @InjectRepository(CreatorIncome)
    private readonly creatorIncomeRepo: Repository<CreatorIncome>,
    @InjectRepository(CreatorPrice)
    private readonly creatorPriceRepo: Repository<CreatorPrice>,
    @InjectRepository(CreatorRoyaltyLevel)
    private readonly creatorLevelRepo: Repository<CreatorRoyaltyLevel>,
    @InjectRepository(CreatorReferralCodeLogs)
    private readonly creatorReferralCodeLogsRepo: Repository<CreatorReferralCodeLogs>,
    @InjectRepository(CreatorReferralCode)
    private readonly creatorReferralCodeRepo: Repository<CreatorReferralCode>,
    @InjectRepository(CreatorCampaignRepository)
    private readonly creatorCampaignRepo: CreatorCampaignRepository,
  ) {}

  // * creatorInfo 조회
  public async findCreatorInfo(creatorId: string): Promise<CreatorInfo> {
    const creatorInfo = await this.creatorInfoRepo.findOne({ where: { creatorId } });
    const rawAccount: string = creatorInfo.creatorAccountNumber || '';
    const deciphedAccountNum: string = encrypto.decipher(rawAccount);
    const deciphedIdentificationNum: string = encrypto.decipher(creatorInfo.identificationNumber);
    const deciphedphoneNum: string = encrypto.decipher(creatorInfo.phoneNumber);
    creatorInfo.identificationNumber = deciphedIdentificationNum;
    creatorInfo.phoneNumber = deciphedphoneNum;
    creatorInfo.creatorAccountNumber = deciphedAccountNum;
    return creatorInfo;
  }

  // * 크리에이터 생성
  public async createCreator(ip: string, dto: CreateCreatorDto): Promise<string> {
    const [encryptedPassword, salt] = encrypto.make(dto.passwd);
    const creatorId = this.getNewCreatorId(dto.userid);

    // creatorInfo 생성
    const newCreator = this.creatorInfoRepo.create({
      creatorId,
      loginId: dto.userid,
      password: encryptedPassword,
      passwordSalt: salt,
      creatorIp: ip,
    });
    // creatorIncome (수익금 테이블 기본값 추가)
    const newIncome = this.creatorIncomeRepo.create({
      creatorId,
      creatorTotalIncome: 0,
      creatorReceivable: 0,
    });
    // creatorPrice 수익률 테이블 기본값 추가
    const newPrice = this.creatorPriceRepo.create({
      creatorId,
      grade: 1,
      viewerAverageCount: 0,
      unitPrice: 2,
    });
    // creatorRoyaltyLevel 레벨 테이블 기본값 추가
    const newLevel = this.creatorLevelRepo.create({
      creatorId,
      level: 1,
      exp: 0,
      visitCount: 0,
    });

    return transactionQuery(
      this.connection,
      async queryRunner => {
        await queryRunner.manager.save(CreatorInfo, newCreator);
        await queryRunner.manager.save(CreatorIncome, newIncome);
        await queryRunner.manager.save(CreatorPrice, newPrice);
        await queryRunner.manager.save(CreatorRoyaltyLevel, newLevel);
        // creatorReferralCodeLogs 가입시 입력한 추천인코드 값 추가
        if (dto.referralCode) {
          const newRefferalCodeLog = this.creatorReferralCodeLogsRepo.create({
            creatorId,
            referralCode: dto.referralCode,
            calculateState: 0,
          });
          await queryRunner.manager.save(CreatorReferralCodeLogs, newRefferalCodeLog);
        }
        return dto.userid;
      },
      { errorMessage: `An error occurred during create creatorInfo (${dto.userid}) - ` },
    );
  }

  // * creatorInfo 정보 수정
  public async updateCreatorInfo(creatorId: string, dto: UpdateCreatorInfoDto): Promise<boolean> {
    if (dto.newIp) {
      const result = await this.creatorInfoRepo._updateCreatorIp(creatorId, dto.newIp);
      if (result) return true;
    }
    if (dto.type === 'contraction') {
      return this.updateCreatorContraction(creatorId);
    }
    if (dto.type === 'CPAAgreement') {
      return this.creatorInfoRepo._updateCreatorCPAAgreement(creatorId, 1); // 1 = OK
    }
    return false;
  }

  // * 기존 유저 통합 로그인 정보 생성
  public async createCreatorInfoPreUser(dto: CreateCreatorPreUserDto): Promise<boolean> {
    const twitchUser = await this.twitchApiService
      .getUserProfile(dto.accessToken, dto.creatorId)
      .catch(() => {
        throw new UnauthorizedException('you are not onad user');
      });
    if (twitchUser) {
      const [encrypted, salt] = encrypto.make(dto.passwd);
      return this.creatorInfoRepo._updateInfoTwitchPreUser({
        creatorId: dto.creatorId,
        loginId: dto.userid,
        password: encrypted,
        passwordSalt: salt,
      });
    }
    throw new UnauthorizedException('you are not onad user');
  }

  // * 정산 정보 등록/수정
  public async updateSettlementInfo(
    creatorId: string,
    dto: UpdateCreatorSettlementInfoDto,
  ): Promise<boolean> {
    const AccountNumber = `${dto.bankName}_${dto.bankAccount}`;
    const encryptedAccountNumber: string = encrypto.encipher(AccountNumber);
    const encryptedCreatorPhone: string = encrypto.encipher(dto.CreatorPhone);
    const encryptedCreatorIdentity: string = encrypto.encipher(dto.CreatorIdentity);

    return this.creatorInfoRepo._updateSettlementInfo(creatorId, {
      ...dto,
      encryptedAccountNumber,
      encryptedCreatorPhone,
      encryptedCreatorIdentity,
    });
  }

  // * 크리에이터 landingUrl 정보 조회
  public async findCreatorLandingUrl(
    creatorId: string,
    type: 'twitch' | 'afreeca',
  ): Promise<string | null> {
    if (type === 'afreeca') {
      const creator = await this.creatorInfoRepo.findOne({
        where: { creatorId, afreecaId: Not(IsNull()) },
        select: ['afreecaId'],
      });
      // afreecaId가 없는 경우 creator가 undefined로 온다.
      if (!creator) return null;
      return this.CREATOR_LANDING_URL_AFREECA_PREFIX + creator.afreecaId;
    }
    const creator = await this.creatorInfoRepo.findOne({
      where: { creatorId, creatorTwitchId: Not(IsNull()) },
      select: ['creatorTwitchId'],
    });
    // creatorTwitchId가 없는 경우 creator가 undefined로 온다.
    if (!creator) return null;
    return this.CREATOR_LANDING_URL_TWITCH_PREFIX + creator.creatorTwitchId;
  }

  // * 크리에이터 광고채팅 허용 여부 조회
  public async findAdchatAgreement(
    creatorId: string,
  ): Promise<Pick<CreatorInfo, 'adChatAgreement'>> {
    return this.creatorInfoRepo.findOne({ where: { creatorId }, select: ['adChatAgreement'] });
  }

  // * 크리에이터 광고 채팅 허용 여부 변경
  public async updateAdchatAgreement(
    creatorId: string,
    targetState: CreatorInfo['adChatAgreement'],
  ): Promise<boolean> {
    return this.creatorInfoRepo._updateAdChatAgreement(creatorId, targetState);
  }

  // * 크리에이터 레벨 조회
  public async findCreatorLevel(creatorId: string): Promise<CreatorRoyaltyLevel> {
    return this.creatorLevelRepo.findOne({ where: { creatorId } });
  }

  // * 크리에이터 비밀번호 확인
  public async findPassword(creatorId: string, requestedPassword: string): Promise<boolean> {
    const creator = await this.creatorInfoRepo.findOne({
      where: { creatorId },
    });
    const isSuccess = encrypto.check(requestedPassword, creator.password, creator.passwordSalt);
    if (isSuccess) return true;
    return false;
  }

  // * 크리에이터 비밀번호 변경
  public async updatePassword(creatorId: string, newPassword: string): Promise<boolean> {
    const [encrypted, salt] = encrypto.make(newPassword);
    return this.creatorInfoRepo._updateCreatorPassword(creatorId, encrypted, salt);
  }

  /**
   * * creatorId 또는 loginId를 기준으로 creatorInfo 정보를 찾습니다.
   * dto argument object에 loginId가 포함되어 있으면, loginId를 기준으로 찾습니다.
   * 그렇지 않으면 creatorId를 기준으로 찾습니다.
   */
  public async findOne({ creatorId, loginId }: FindCreatorDto): Promise<CreatorInfo> {
    if (loginId) {
      return this.creatorInfoRepo.findOne({
        where: { loginId },
      });
    }
    return this.creatorInfoRepo.findOne({
      where: [{ creatorId }],
    });
  }

  /**
   * * twitchOriginalId를 기준으로 creatorInfo 정보를 찾습니다.
   */
  public async findOneByTwitchOriginalId(twitchOriginalId: string): Promise<CreatorInfo> {
    return this.creatorInfoRepo.findOne({ where: { creatorTwitchOriginalId: twitchOriginalId } });
  }

  /**
   * * 방송인의 트위치 연동 정보를 최신화합니다.
   * 이 메서드는 TwitchAPI 요청부터 시작합니다.
   * API 요청을 통해 받아온 TwitchProfile 정보가 이미 있다면 `updateTwitchInfoFromTwitchProfile` 함수를 사용하세요.
   * @param user 크리에이터 정보
   * @returns affectedRows
   */
  public async updateTwitchInfoWithTwitchAPIRequest(
    user: CreatorInfo,
  ): Promise<'success' | 'fail'> {
    // 트위치 refresh token 가져오기
    const previousRefreshToken = user.creatorTwitchRefreshToken;

    // refresh token으로 access token 생성
    const { access_token: accessToken, refresh_token: refreshToken } =
      await this.twitchApiService.getAccessToken(previousRefreshToken);

    // refresh token으로 user profile 요청
    const userProfile = await this.twitchApiService.getUserProfile(
      accessToken,
      user.creatorTwitchOriginalId,
    );

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
   * * 방송인의 트위치 연동 정보를 최신화합니다.
   * @param creatorId 크리에이터 아이디
   * @param refreshToken 리프레시토큰
   * @param profile 트위치 API 요청을 통해 받은 유저프로필 정보
   * @returns affectedRows
   */
  public async updateTwitchInfoFromTwitchProfile(
    creatorId: string,
    refreshToken: string,
    profile: TwitchProfile,
  ): Promise<number> {
    return this.creatorInfoRepo._updateTwitchInfo(creatorId, refreshToken, profile);
  }

  /**
   * * 아프리카 연동 정보 최신화
   * @param user CreatorInfo
   * @returns 'success' | 'fail'
   */
  public async updateAfreecaInfo(user: CreatorInfo): Promise<'success' | 'fail'> {
    // 아프리카 정보 가져오기
    const { nickname, logo } = await this.afreecaApiService.getUserProfile(user.afreecaId);
    // 변경사항이 있는제 치크하여 유저 정보 업데이트
    return this.creatorInfoRepo._updateAfreecaInfo(user.creatorId, nickname, logo);
  }

  /**
   * * 크리에이터(방송인)의 트위치 리프레시토큰을 변경
   * @param creatorId 크리에이터 아이디
   * @param refreshToken 변경할 리프레시 토큰
   * @returns affected rows
   */
  public async replaceTwitchRefreshToken(
    creatorId: CreatorInfo['creatorId'],
    refreshToken: string,
  ): Promise<boolean> {
    return this.creatorInfoRepo._replaceTwitchRefreshToken(creatorId, refreshToken);
  }

  // ***************************************
  // * Private Methods
  // ***************************************
  private getNewCreatorId(userId: string): string {
    return `V2_${userId}_${new Date().getTime()}`;
  }

  // * 크리에이터 이용동의
  private async updateCreatorContraction(creatorId: string): Promise<boolean> {
    // ***************************************************************************
    // 201207 - advertiseURL 생성 기능 여기서 추가필요. ( 기존,회원가입시 -> 변경,이용계약시 수정 )
    const creatorBannerUrl = `/${nanoid(8)}`;
    const remoteControllerUrl = `/${nanoid(8)}`;
    const myReferralCode = nanoid();

    return transactionQuery(
      this.connection,
      async queryRunner => {
        // 크리에이터 계약처리
        await this.creatorInfoRepo._updateCreatorContraction(
          creatorId,
          creatorBannerUrl,
          remoteControllerUrl,
        );
        // 계약시 생성되는 creatorCampaign 기본값
        const cc = await queryRunner.manager.findOne(CreatorCampaign, { where: { creatorId } });
        if (!cc) {
          const newCreatorCampaign = this.creatorCampaignRepo.new(creatorId);
          await queryRunner.manager.insert(CreatorCampaign, newCreatorCampaign);
        }
        // 계약시 생성되는 추천인 코드 기본값 추가 작업.
        const crc = await queryRunner.manager.findOne(CreatorReferralCode, {
          where: { creatorId },
        });
        if (!crc) {
          const newCrc = this.creatorReferralCodeRepo.create({
            creatorId,
            referralCode: myReferralCode,
          });
          await queryRunner.manager.insert(CreatorReferralCode, newCrc);
        }
        return true;
      },
      { errorMessage: `An error occurred during CreatorInfo contraction update (${creatorId}) - ` },
    );
  }
}
