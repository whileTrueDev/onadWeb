import { Controller, Get, Post, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './guards/google.guard';
import { KakaoAuthGuard } from './guards/kakao.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { NaverAuthGuard } from './guards/naver.guard';
import { PreCreatorTwitchExceptionFilter } from './guards/preCreatorTwitch.filter';
import { PreCreatorTwitchAuthGuard } from './guards/preCreatorTwitch.guard';

@Controller('login')
export class LoginController {
  HOST: string;

  constructor(private readonly configService: ConfigService) {
    this.HOST = configService.get('REACT_HOSTNAME');
  }

  @UseGuards(LocalAuthGuard)
  @Post()
  localLogin(@Req() req: Request): Express.User {
    return req.user;
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
  @Get('naver/calback')
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
  @Get('kakao/calback')
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
