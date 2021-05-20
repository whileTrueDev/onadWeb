import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class MarketerGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.get<string>('API_HOSTNAME' || 'http://localhost:3000')}/login/google/callback`,
      scope: ['eamil', 'profile'],
    });
  }

  authorizationParams(option: any): any {
    return Object.assign(option, { access_type: 'offline', prompt: 'consent', include_granted_scopes: true, });
  }

  // validate 함수를 오버라이딩 하여야 합니다.
  async validate(
    accessToken: string, refreshToken: string, profile: Profile,
  ): Promise<any> {
    return this.authService.googleLogin(profile); // returns User 
  }
}
