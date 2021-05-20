import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { OnadSession } from '../../../interfaces/Session.interface';
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
      scope: ['email', 'profile'],
    });
  }

  authorizationParams(option: any): any {
    return Object.assign(option, { access_type: 'offline', prompt: 'consent', include_granted_scopes: true, });
  }

  async validate(
    accessToken: string, refreshToken: string, profile: Profile,
  ): Promise<OnadSession & { marketerPlatformData?: string }> {
    return this.authService.googleLogin(profile); // returns User 
  }
}
