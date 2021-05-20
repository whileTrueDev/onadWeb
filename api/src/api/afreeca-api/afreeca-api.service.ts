/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface BJApiAfreecaProfile {
  profile_image: string;
  station: {
    user_nick: string;
  };
}


@Injectable()
export class AfreecaApiService {
  getUserProfile(
    afreecaId: string
  ): Promise<{nickname: string; logo: string}> {
    const profileUrl = `https://bjapi.afreecatv.com/api/${afreecaId}/station`;
    const headers = { 'User-Agent': 'Mozilla/5.0' };

    return axios.get<BJApiAfreecaProfile>(profileUrl, { headers })
      .then((res) => ({
        logo: `https:${res.data.profile_image}`,
        nickname: res.data.station.user_nick,
      }))
      .catch((err) => {
        console.error('Error occurred in getUserProfile - ', err.response.data);
        throw err;
      });
  }
}
