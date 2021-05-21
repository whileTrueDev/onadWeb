import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile as NaverProfile, Strategy } from 'passport-naver';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class MarketerNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('NAVER_CLIENT_ID'),
      clientSecret: configService.get<string>('NAVER_CLIENT_SECRET'),
      callbackURL: `${configService.get<string>(
        'API_HOSTNAME' || 'http://localhost:3000',
      )}/login/naver/callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: NaverProfile,
  ): Promise<MarketerSession> {
    return this.authService.naverLogin(profile);
  }
}
