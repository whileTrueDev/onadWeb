/* eslint-disable camelcase */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'passport-google-oauth20';
import { Repository } from 'typeorm';
import { LoginStamp } from '../../entities/LoginStamp';
import { CreatorSession, MarketerSession } from '../../interfaces/Session.interface';
import encryption from '../../utils/encryption';
import { CreatorService } from '../creator/creator.service';
import { MarketerService } from '../marketer/marketer.service';
import { LoginDto } from './dto/login.dto';

export type UserType = 'creator' | 'marketer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(LoginStamp) private readonly loginStampRepo: Repository<LoginStamp>,
    private readonly creatorService: CreatorService,
    private readonly marketerService: MarketerService,
  ) {}

  public login(type?: UserType, loginDto?: LoginDto): any { // return User
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

    if (!(encryption.check(password, creator.password, creator.passwordSalt))) {
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
      this.creatorService.updateTwitchInfo(creator).then((result) => {
        if (result === 'success') console.log(`트위치 연동 정보 최신화 성공 - ${userId}`);
        if (result === 'fail') console.log(`트위치 연동 정보 최신화 실패 - ${userId}`);
      }).catch((err) => console.error(`트위치 연동 정보 최신화 실패 - ${err}`));
    }

    // 아프리카 연동한 상태라면, 아프리카 연동 정보 최신화 
    if (creator.afreecaId) {
      this.creatorService.updateAfreecaInfo(creator).then((result) => {
        if (result === 'success') console.log(`아프리카 연동 정보 최신화 성공 - ${userId}`);
        if (result === 'fail') console.log(`아프리카 연동 정보 최신화 실패 - ${userId}`);
      }).catch((err) => console.error(`아프리카 연동 정보 최신화 실패 - ${err}`));
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

    if (!(encryption.check(password, marketer.marketerPasswd, marketer.marketerSalt))) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const user: MarketerSession = {
      marketerId: userId,
      userType: 'marketer',
      marketerMail: marketer.marketerMail,
      marketerAccountNumber: marketer.marketerAccountNumber,
      marketerBusinessRegNum: marketer.marketerBusinessRegNum,
      marketerName: marketer.marketerName,
      marketerPhoneNum: marketer.marketerPhoneNum,
    };

    this.marketerLoginStamp(user.marketerId);

    console.log(`${marketer.marketerName} 로그인 하였습니다.`);
    return user;
  }

  public async googleLogin(profile: Profile) {
    const jsonData = profile._json;
    const {
      sub, given_name, family_name, email
    } = jsonData;

    const marketer = await this.marketerService.findOne(sub);

    // 이미 구글로그인을 통해 가입한 경우 로그인 처리
    if (marketer) {
      const user: MarketerSession = {
        marketerId: marketer.marketerId,
        userType: 'marketer',
        marketerMail: marketer.marketerMail,
        marketerAccountNumber: marketer.marketerAccountNumber,
        marketerBusinessRegNum: marketer.marketerBusinessRegNum,
        marketerName: marketer.marketerName,
        marketerPhoneNum: marketer.marketerPhoneNum,
        registered: true
      };
      this.marketerLoginStamp(user.marketerId);
      console.log(`[${new Date().toLocaleString()}] [마케터구글로그인] ${user.marketerName}`);
      return user;
    }

    // 이미 구글로그인을 통해 가입한 경우 회원가입 처리 (registered속성을 통해)
    const user = {
      userType: 'marketer',
      marketerMail: email,
      marketerName: family_name + given_name,
      marketerPlatformData: sub,
      registered: false
    };

    return user;
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
}
