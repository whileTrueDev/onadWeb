import Axios from 'axios';
import doQuery from '../../../../model/doQuery';

export interface TwitchTokenRes {
  access_token: string; refresh_token: string; scope: string;
}
/**
 * refresh_token을 통해 access_token을 새로 발급받습니다.
 * @param refreshToken 온애드 연동시 발급 받은 트위치 auth용 refresh_token
 */
export async function getAccessToken(refreshToken: string): Promise<TwitchTokenRes> {
  const tokenUrl = 'https://id.twitch.tv/oauth2/token';
  const params = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
  };

  return Axios.post<TwitchTokenRes>(tokenUrl, null, { params })
    .then((res) => res.data)
    .catch((err) => {
      console.error('Error occurred in getAccessToken - ', err.response.data);
      throw err;
    });
}

export interface TwitchProfile {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email: string;
}
/**
 * 트위치 유저 정보를 가져옵니다.
 * @param access_token 트위치 엑세스 토큰 - 유효한 토큰이여야 합니다.
 * @param creatorId 유저 프로필을 조회할 유저의 트위치 고유 ID
 */
export async function getUserProfile(
  access_token: string, creatorId: string
): Promise<TwitchProfile> {
  const profileUrl = 'https://api.twitch.tv/helix/users';
  const headers = {
    Authorization: `Bearer ${access_token}`,
    'Client-Id': process.env.TWITCH_CLIENT_ID
  };
  const params = { id: creatorId };

  return Axios.get<{data: TwitchProfile[]}>(profileUrl, { headers, params })
    .then((res) => res.data.data[0])
    .catch((err) => {
      console.error('Error occurred in getUserProfile - ', err.response.data);
      throw err;
    });
}

export interface User {
  creatorId: string;
  creatorName: string;
  creatorMail: string;
  creatorTwitchId: string;
  creatorLogo: string;
  creatorTwitchRefreshToken: string;
}
/**
 * 트위치 연동 정보 업데이트 함수.
 * @param user 트위치 연동 정보를 업데이트 하고자 하는 유저 객체.
 */
export default async function twitchUpdate(user: User): Promise<string> {
  // 트위치 refresh token 가져오기
  const previousRefreshToken = user.creatorTwitchRefreshToken;

  // refresh token으로 access token 생성
  const {
    access_token: accessToken,
    refresh_token: refreshToken,
  } = await getAccessToken(previousRefreshToken);

  // refresh token으로 user profile 요청
  const userProfile = await getUserProfile(accessToken, user.creatorId);

  // 변경사항이 있는제 치크하여 유저 정보 업데이트
  const updateQuery = `
  UPDATE creatorInfo
  SET creatorName = ?, creatorTwitchId = ?, creatorMail = ?,
  creatorLogo = ?, creatorTwitchRefreshToken = ?
  WHERE creatorId = ?`;
  const updateQueryArray = [
    userProfile.display_name, userProfile.login, userProfile.email,
    userProfile.profile_image_url, refreshToken, user.creatorId,
  ];

  return doQuery(updateQuery, updateQueryArray)
    .then((row) => {
      if (row.result.affectedRows > 0) {
        return 'success';
      }
      return 'fail';
    })
    .catch((err) => {
      console.error(`An error occurred in - twitchUpdate, doQuery ${err}`);
      throw err;
    });
}
