import {
  Controller, Get, Post, Req, Res, UseGuards
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './guards/google.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('login')
export class LoginController {
  @UseGuards(LocalAuthGuard)
  @Post()
  localLogin(@Req() req: Request): Express.User {
    return req.user;
  }

  @UseGuards(GoogleAuthGuard)
  @Post('google')
  @Get('google')
  googleLogin(@Req() req: Request): Express.User {
    return req.user;
  }

  @UseGuards(GoogleAuthGuard)
  @Post('google/callback')
  @Get('google/callback')
  googleLoginCallback(@Res() res: Response) {
    // 구글로그인 콜백함수 추가
    // console.log(sess);
    // if (sess.registered) {
    //   console.log('success google login');
    //   res.redirect(`${HOST}/mypage/marketer/main`);
    // } else {
    //   console.log('success google login - 정보입력');
    //   res.redirect(`${HOST}/regist/google`);
    // }
  }
}
