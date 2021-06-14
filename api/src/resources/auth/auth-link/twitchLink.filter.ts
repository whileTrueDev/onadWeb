import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Catch()
export class TwitchLinkExceptionFilter implements ExceptionFilter {
  HOST: string;

  constructor(private readonly configService: ConfigService) {
    this.HOST = configService.get('REACT_HOSTNAME') ?? 'http://localhost:3000';
  }

  catch(err: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    console.log('[TwitchLinkExceptionFilter] ERROR => ', err);
    if (err.message) {
      res.redirect(`${this.HOST}/mypage/creator/user?${err.message}&platform=twitch`);
    } else res.redirect(`${this.HOST}/mypage/creator/user?error=error&platform=twitch`);
  }
}
