import { Controller, Get, Post, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { MarketerService } from '../marketer/marketer.service';
import { GoogleAuthGuard } from './guards/google.guard';
import { KakaoAuthGuard } from './guards/kakao.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { NaverAuthGuard } from './guards/naver.guard';
import { PreCreatorTwitchExceptionFilter } from './guards/preCreatorTwitch.filter';
import { PreCreatorTwitchAuthGuard } from './guards/preCreatorTwitch.guard';
import { LoginCheckRes } from './interfaces/loginCheckRes.interface';

@Controller('login')
export class LoginController {
  HOST: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly marketerService: MarketerService,
  ) {
    this.HOST = configService.get('REACT_HOSTNAME');
  }

  @Get('check')
  async check(@Req() req: Request): Promise<LoginCheckRes> {
    if (req.user) {
      const session = req.user;
      if (session.userType === 'marketer') {
        const marketer = await this.marketerService.findOne(session.marketerId);
        if (marketer.temporaryLogin === 1) return { error: false, state: 1 };
        return { error: false, state: 0, userType: 'marketer' };
      }
      if (session.userType === 'creator') {
        return { error: false, state: 0, userType: 'creator' };
      }
    }
    return { error: true };
  }

  @UseGuards(LocalAuthGuard)
  @Post()
  localLogin(@Req() req: Request): [boolean, Express.User | string] | string {
    if (req.user.userType === 'creator') return 'success';
    return [false, req.user];
  }

  // *********************************************
  // marketer Google login
  // *********************************************
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleLogin(@Req() req: Request): Express.User {
    return req.user;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  googleLoginCallback(@Req() req: Request, @Res() res: Response): void {
    // 구글로그인 콜백함수 추가
    console.log('req.user from google login controller: ', req.user);
    if (req.user.registered) {
      return res.redirect(`${this.HOST}/mypage/marketer/main`);
    }
    console.log('success google login -> 최초 로그인이므로 정보입력');
    return res.redirect(`${this.HOST}/regist/google`);
  }

  // *********************************************
  // marketer Naver login
  // *********************************************
  @UseGuards(NaverAuthGuard)
  @Get('naver')
  naverLogin(@Req() req: Request): Express.User {
    return req.user;
  }

  @UseGuards(NaverAuthGuard)
  @Get('naver/callback')
  naverLoginCallback(@Req() req: Request, @Res() res: Response): void {
    if (req.user.registered) {
      return res.redirect(`${this.HOST}/mypage/marketer/main`);
    }
    console.log('success naver login -> 최초 로그인이므로 정보입력');
    return res.redirect(`${this.HOST}/regist/naver`);
  }

  // *********************************************
  // marketer Kakao login
  // *********************************************
  @UseGuards(KakaoAuthGuard)
  @Get('kakao')
  kakaoLogin(@Req() req: Request): Express.User {
    return req.user;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('kakao/callback')
  kakaoLoginCallback(@Req() req: Request, @Res() res: Response): void {
    if (req.user.registered) {
      return res.redirect(`${this.HOST}/mypage/marketer/main`);
    }
    console.log('success kakao login -> 최초 로그인이므로 정보입력');
    return res.redirect(`${this.HOST}/regist/kakao`);
  }

  // *********************************************
  // creator pre-user twitch oauth verification
  // *********************************************
  @UseGuards(PreCreatorTwitchAuthGuard)
  @Get('/twitch/pre-creator')
  preCreatorTwitchVerification(@Req() req: Request): Express.User {
    return req.user;
  }

  // 커스텀 에러 filter 적용 필요
  @UseFilters(PreCreatorTwitchExceptionFilter)
  @UseGuards(PreCreatorTwitchAuthGuard)
  @Get('/twitch/pre-creator/callback')
  preCreatorTwitchVerificationCallback(@Req() req: Request, @Res() res: Response): void {
    const { creatorId, creatorName, accessToken } = req.user as any;
    res.redirect(
      [
        `${this.HOST}/creator/signup/pre-user`,
        `?creatorId=${creatorId}`,
        `&creatorName=${creatorName}`,
        `&accessToken=${accessToken}`,
      ].join(''),
    );
  }
}
