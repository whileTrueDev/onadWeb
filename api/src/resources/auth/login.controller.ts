import {
  Controller, Get, Post, Req, Res, Session, UseGuards
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { SessionData } from 'express-session';
import { MarketerSession } from '../../interfaces/Session.interface';
import { GoogleAuthGuard } from './guards/google.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('login')
export class LoginController {
  HOST: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.HOST = configService.get('REACT_HOSTNAME');
  }
  @UseGuards(LocalAuthGuard)
  @Post()
  localLogin(@Req() req: Request): Express.User {
    return req.user;
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response): void {
    req.logout();
    if (req.session) {
      req.session.destroy((err) => {
        console.log('logout error - ', err);
      });
    }
    res.end();
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleLogin(@Req() req: Request): Express.User {
    return req.user;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  googleLoginCallback(
    @Req() req: Request, @Session() session: MarketerSession, @Res() res: Response
  ): void {
    console.log('req.user: ', req.user);
    // 구글로그인 콜백함수 추가
    if (req.user.registered) {
      console.log('success google login');
      return res.redirect(`${this.HOST}/mypage/marketer/main`);
    }
    console.log('success google login - 최초 로그인 정보입력');
    return res.redirect(`${this.HOST}/regist/google`);
  }
}
