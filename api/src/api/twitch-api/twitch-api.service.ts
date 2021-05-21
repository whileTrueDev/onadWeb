/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import { TwitchTokenRes, TwitchProfile } from '../../interfaces/TwitchProfile.interface';

@Injectable()
export class TwitchApiService {
  getAccessToken(refreshToken: string): Promise<TwitchTokenRes> {
    const tokenUrl = 'https://id.twitch.tv/oauth2/token';
    const params = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
    };

    return Axios.post<TwitchTokenRes>(tokenUrl, null, { params })
      .then(res => res.data)
      .catch(err => {
        console.error('Error occurred in getAccessToken - ', err.response.data);
        throw err;
      });
  }

  getUserProfile(access_token: string, creatorId?: string): Promise<TwitchProfile> {
    const profileUrl = 'https://api.twitch.tv/helix/users';
    const headers = {
      Authorization: `Bearer ${access_token}`,
      'Client-Id': process.env.TWITCH_CLIENT_ID,
    };
    const params = { id: creatorId };

    return Axios.get<{ data: TwitchProfile[] }>(profileUrl, { headers, params })
      .then(res => res.data.data[0])
      .catch(err => {
        console.error('Error occurred in getUserProfile - ', err.response.data);
        throw err;
      });
  }
}
