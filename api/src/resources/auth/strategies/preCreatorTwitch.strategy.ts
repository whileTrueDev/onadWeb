/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { TwitchApiService } from '../../../api/twitch-api/twitch-api.service';
import { CreatorSession } from '../../../interfaces/Session.interface';
import { TwitchProfile } from '../../../interfaces/TwitchProfile.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class PreCreatorTwitchStrategy extends PassportStrategy(Strategy, 'twitch-pre-creator') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly twitchApiService: TwitchApiService,
  ) {
    super({
      clientID: configService.get<string>('TWITCH_CLIENT_ID'),
      clientSecret: configService.get<string>('TWITCH_CLIENT_SECRET'),
      scope: [
        'user:read:email',
        // 'user:read:broadcast',
        // 'channel:read:subscriptions',
        // 'analytics:read:extensions',
        // 'analytics:read:games',
      ],
      authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
      tokenURL: 'https://id.twitch.tv/oauth2/token',
      callbackURL: `${configService.get<string>(
        'API_HOSTNAME' || 'http://localhost:3000',
      )}/login/twitch/pre-creator/callback`,
    });

    this._oauth2.setAuthMethod('Bearer');
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  authorizationParams(options: any): any {
    const params: Record<string, any> = { ...options, force_verify: true };
    return params;
  }

  // 유저 정보 조회
  async userProfile(
    accessToken: string,
    done: (err?: Error, profile?: TwitchProfile) => void,
  ): Promise<void> {
    const profile = await this.twitchApiService.getUserProfile(accessToken);
    done(null, profile);
  }

  // passport validate
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: TwitchProfile,
  ): Promise<CreatorSession & { accessToken: string }> {
    return this.authService.twitchPreCreatorVerify(accessToken, refreshToken, profile);
  }
}
