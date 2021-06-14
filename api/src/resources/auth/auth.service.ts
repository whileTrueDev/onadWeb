/* eslint-disable camelcase */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { Profile as NaverProfile } from 'passport-naver';
import { Profile as KakaoProfile } from 'passport-kakao';
import { Repository } from 'typeorm';
import { LoginStamp } from '../../entities/LoginStamp';
import { CreatorSession, MarketerSession, OnadSession } from '../../interfaces/Session.interface';
import encryption from '../../utils/encryption';
import { CreatorService } from '../creator/creator.service';
import { MarketerService } from '../marketer/marketer.service';
import { LoginDto } from './dto/login.dto';
import { TwitchProfile } from '../../interfaces/TwitchProfile.interface';
import { CreatorInfo } from '../../entities/CreatorInfo';
import { MarketerInfo } from '../../entities/MarketerInfo';

export type UserType = 'creator' | 'marketer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(LoginStamp) private readonly loginStampRepo: Repository<LoginStamp>,
    private readonly creatorService: CreatorService,
    private readonly marketerService: MarketerService,
  ) {}

  public localLogin(type?: UserType, loginDto?: LoginDto): Promise<OnadSession> {
    // return User
    switch (type) {
      case 'creator':
        return this.creatorLocalLogin(loginDto.userId, loginDto.password);
      case 'marketer':
        return this.marketeLocalrLogin(loginDto.userId, loginDto.password);
      default:
        throw new UnauthorizedException();
    }
  }

  /**
   * 크리에이터(방송인) 로그인 로직
   * @param userId 아이디
   * @param password 비번
   * @returns userSession - creator
   */
  private async creatorLocalLogin(userId: string, password: string) {
    console.log(`creator new 통합 Login request - ${userId}`);
    // 유저 정보 조회
    const creator = await this.creatorService.findOne({ loginId: userId });
    if (!creator) throw new UnauthorizedException('회원이 아닙니다.');

    if (!encryption.check(password, creator.password, creator.passwordSalt)) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    const user: CreatorSession = {
      userType: 'creator',
      creatorId: creator.creatorId,
      creatorIp: creator.creatorIp,
    };

    // ***************************************************
    // 트위치 연동한 상태라면, 트위치 연동 정보 최신화
    if (creator.creatorTwitchOriginalId) {
      this.creatorService
        .updateTwitchInfoWithTwitchAPIRequest(creator)
        .then(result => {
          if (result === 'success') console.log(`트위치 연동 정보 최신화 성공 - ${userId}`);
          if (result === 'fail') console.log(`트위치 연동 정보 최신화 실패 - ${userId}`);
        })
        .catch(err => console.error(`트위치 연동 정보 최신화 실패 - ${err}`));
    }

    // 아프리카 연동한 상태라면, 아프리카 연동 정보 최신화
    if (creator.afreecaId) {
      this.creatorService
        .updateAfreecaInfo(creator)
        .then(result => {
          if (result === 'success') console.log(`아프리카 연동 정보 최신화 성공 - ${userId}`);
          if (result === 'fail') console.log(`아프리카 연동 정보 최신화 실패 - ${userId}`);
        })
        .catch(err => console.error(`아프리카 연동 정보 최신화 실패 - ${err}`));
    }

    return user;
  }

  /**
   * 마케터(광고주) 로그인 로직
   * @param userId marketer 아이디
   * @param password 마케터 비밀번호
   * @returns userSession - matkerer
   */
  private async marketeLocalrLogin(userId: string, password: string) {
    console.log(`marketer Login request - ${userId}`);
    // 마케터 로그인
    const marketer = await this.marketerService.findOne(userId);
    if (!marketer) throw new UnauthorizedException('회원이 아닙니다.');

    if (!encryption.check(password, marketer.marketerPasswd, marketer.marketerSalt)) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const user = this.createMarketerSession(marketer);

    this.marketerLoginStamp(user.marketerId);

    console.log(`${marketer.marketerName} 로그인 하였습니다.`);
    return user;
  }

  /**
   * 광고주 구글 로그인
   * @param profile 구글Profile 정보
   */
  public async googleLogin(profile: GoogleProfile): Promise<MarketerSession> {
    const jsonData = profile._json;
    const { sub, given_name, family_name, email } = jsonData;

    const marketer = await this.marketerService.findOneByPlatform(sub, 'google');
    // 첫 가입한 경우 회원가입 처리 (registered속성을 통해)
    if (!marketer) {
      const unregisteredUser = {
        userType: 'marketer' as const,
        marketerMail: email,
        marketerName: family_name + given_name,
        marketerPlatformData: sub,
        registered: false,
      };
      return unregisteredUser;
    }

    // 이미 구글로그인을 통해 가입한 경우 로그인 처리
    const user = this.createMarketerSession(marketer);
    this.marketerLoginStamp(user.marketerId);
    console.log(`[${new Date().toLocaleString()}] [마케터구글로그인] ${user.marketerName}`);
    return user;
  }

  public async naverLogin(profile: NaverProfile): Promise<MarketerSession> {
    const jsonData = profile._json;
    const { email, id } = jsonData;
    const marketer = await this.marketerService.findOneByPlatform(id, 'naver');
    if (!marketer) {
      const unregisteredUser: MarketerSession = {
        userType: 'marketer',
        marketerPlatformData: id,
        registered: false,
        marketerMail: email,
      };
      return unregisteredUser;
    }

    const user = this.createMarketerSession(marketer);
    this.marketerLoginStamp(marketer.marketerId);
    console.log(`[${new Date().toLocaleString()}] [마케터네이버로그인] ${user.marketerName}`);
    return user;
  }

  public async kakaoLogin(profile: KakaoProfile): Promise<MarketerSession> {
    const jsonData = profile._json;
    const { kakao_account, id } = jsonData;
    const marketer = await this.marketerService.findOneByPlatform(id, 'kakao');
    if (!marketer) {
      const unregisteredUser: MarketerSession = {
        userType: 'marketer',
        marketerPlatformData: id,
        registered: false,
      };
      if (kakao_account.has_email) {
        unregisteredUser.marketerMail = kakao_account.email;
      }
      return unregisteredUser;
    }

    const user = this.createMarketerSession(marketer);
    this.marketerLoginStamp(marketer.marketerId);
    console.log(`[${new Date().toLocaleString()}] [마케터카카오로그인] ${user.marketerName}`);
    return user;
  }

  /**
   * 트위치 oauth 인증을 통해 기존 온애드 유저인지를 확인 (통합로그인을 위해)
   * @param accessToken 액세스 토큰
   * @param refreshToken 리프레시 토큰
   * @param profile 트위치 유저 프로필
   * @returns accessToken을 포함한 CreatorSession
   */
  public async twitchPreCreatorVerify(
    accessToken: string,
    refreshToken: string,
    profile: TwitchProfile,
  ): Promise<CreatorSession & { accessToken: string }> {
    // 이전에 트위치 로그인을 사용해 사용했던 크리에이터를 찾는다. V
    const creator = await this.creatorService.findOne({ creatorId: profile.id });
    if (!creator) throw new Error('error=no-pre-creator');

    // 프론트로 보낸다. ( 크리에이터 아이디/이름과 엑세스 토큰을 ) V
    // 해당 크리에이터의 twitch api 리프레시 토큰 삽입
    this.creatorService.replaceTwitchRefreshToken(creator.creatorId, refreshToken);

    const user: CreatorSession & { accessToken: string } = {
      userType: 'creator',
      accessToken,
      creatorId: creator.creatorId,
      creatorName: creator.creatorName,
    };

    return user;
  }

  /**
   * 트위치 oauth 인증을 통해 트위치 계정을 온애드 방송인 계정에 연동
   * @param creatorId 크리에이터 아이디
   * @param refreshToken 리프레시 토큰
   * @param profile 트위치 유저 프로필
   * @returns CreatorSession
   */
  public async twitchLink(
    creatorId: CreatorInfo['creatorId'],
    refreshToken: string,
    profile: TwitchProfile,
  ): Promise<CreatorSession> {
    const newCreatorTwitchOriginalId = profile.id; // 트위치 고유 아이디 (ex. 13009139)
    const newCreatorTwitchId = profile.login; // 트위치 로그인 아이디 (ex. hwasurr)

    // ***************************************************
    // 기존 유저 체크
    // 이전 온애드 계정 사용으로, creatorId 가 twitchId인 경우 (본인일 수 있음)
    const alreadyLinkedCreator = await this.creatorService.findOne({
      creatorId: newCreatorTwitchOriginalId,
    });
    if (
      alreadyLinkedCreator &&
      alreadyLinkedCreator.creatorTwitchId === newCreatorTwitchId &&
      alreadyLinkedCreator.creatorId === newCreatorTwitchOriginalId
    ) {
      // 기존 유저 + 연동 요청의 경우
      throw new Error('error=precreator');
    } else {
      // ***************************************************
      // 연결된 다른 유저가 있는지 조회
      const alreadyLinkedUser = await this.creatorService.findOneByTwitchOriginalId(
        newCreatorTwitchOriginalId,
      );
      if (alreadyLinkedUser) {
        // loginId가 있는 새로운 로그인 방식으로 가입한 다른 유저의 경우
        const user = `${alreadyLinkedUser.loginId.slice(
          0,
          alreadyLinkedUser.loginId.length - 2,
        )}**`;
        throw new Error(`error=alreadyLinked&user=${user}`);
      }

      // 이미 해당 twitch 아이디에 연결된 유저가 없는 경우.
      // 정상 연결 작업
      const affected = await this.creatorService.updateTwitchInfoFromTwitchProfile(
        creatorId,
        refreshToken,
        profile,
      );
      if (affected === 0 || !affected) throw new Error('DB Update Error');
      return { userType: 'creator', creatorId };
    }
  }

  /**
   * 마케터 로그인 기록을 남기는 메서드
   * @param marketerId 마케터 아이디
   * @returns LoginStamp
   */
  private marketerLoginStamp(marketerId: string): Promise<LoginStamp> {
    const stamp = this.loginStampRepo.create({ userId: marketerId, userIp: '', userType: 1 });
    return this.loginStampRepo.save(stamp);
  }

  private createMarketerSession(marketer: MarketerInfo): MarketerSession {
    return {
      userType: 'marketer',
      marketerId: marketer.marketerId,
      marketerMail: marketer.marketerMail,
      marketerAccountNumber: marketer.marketerAccountNumber,
      marketerBusinessRegNum: marketer.marketerBusinessRegNum,
      marketerName: marketer.marketerName,
      marketerPhoneNum: marketer.marketerPhoneNum,
      registered: true,
    };
  }
}
