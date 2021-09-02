import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Catch()
export class PreCreatorTwitchExceptionFilter implements ExceptionFilter {
  HOST: string;

  constructor(private readonly configService: ConfigService) {
    this.HOST = configService.get('REACT_HOSTNAME') ?? 'http://localhost:3000';
  }

  catch(err: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    console.log('[PreCreatorTwitchExceptionFilter] ERROR => ', err);
    if (err.message) {
      res.redirect(`${this.HOST}/regist/pre-user?${err.message}&platform=twitch`);
    } else res.redirect(`${this.HOST}/regist/pre-user?error=error&platform=twitch`);
  }
}
