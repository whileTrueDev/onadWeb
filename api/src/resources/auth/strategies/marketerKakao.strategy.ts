import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile as KakaoProfile, Strategy } from 'passport-kakao';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class MarketerKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
      // from https://github.com/rotoshine/passport-kakao#readme
      clientSecret: '',
      callbackURL: `${configService.get<string>(
        'API_HOSTNAME' || 'http://localhost:3000',
      )}/login/kakao/callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: KakaoProfile,
  ): Promise<MarketerSession> {
    return this.authService.naverLogin(profile);
  }
}
