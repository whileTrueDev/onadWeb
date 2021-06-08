/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Axios from 'axios';
import { TwitchTokenRes, TwitchProfile } from '../../interfaces/TwitchProfile.interface';

@Injectable()
export class TwitchApiService {
  constructor(private readonly configService: ConfigService) {}
  getAccessToken(refreshToken: string): Promise<TwitchTokenRes> {
    const tokenUrl = 'https://id.twitch.tv/oauth2/token';
    const params = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.configService.get<string>('TWITCH_CLIENT_ID'),
      client_secret: this.configService.get<string>('TWITCH_CLIENT_SECRET'),
    };

    return Axios.post<TwitchTokenRes>(tokenUrl, null, { params })
      .then(res => res.data)
      .catch(err => {
        console.error('Error occurred in getAccessToken - ', err.response.data);
        throw err;
      });
  }

  getUserProfile(accessToken: string, creatorId?: string): Promise<TwitchProfile> {
    const profileUrl = 'https://api.twitch.tv/helix/users';
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Client-Id': this.configService.get<string>('TWITCH_CLIENT_ID'),
    };
    const params = { id: creatorId };

    return Axios.get<{ data: TwitchProfile[] }>(profileUrl, { headers, params })
      .then(res => res.data.data[0])
      .catch(err => {
        console.error('Error occurred in getUserProfile - ', err.response.data);
        throw err;
      });
  }

  getUserFollower(accessToken, creatorId: string) {
    const followerUrl = `https://api.twitch.tv/helix/users/follows?to_id=${creatorId}`;
    const headers = {
      'Client-Id': this.configService.get<string>('TWITCH_CLIENT_ID'),
      Authorization: `Bearer ${accessToken}`,
    };
    Axios.get(followerUrl, { headers })
      .then(response => {
        const followers = response.data.total;
        return followers;
      })
      .catch(error => {
        console.log('twitch API를 통한 구독자수 요청 실패 - ', error);
        throw error;
      });
  }
}
