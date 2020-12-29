import Axios from 'axios';
import doQuery from '../../../../model/doQuery';

export interface BJApiAfreecaProfile {
  profile_image: string;
  station: {
    user_nick: string;
  };
}
/**
 * 아프리카 유저 정보를 가져옵니다.
 * @param afreecaId 유저 프로필을 조회할 유저의 아프리카 유저의 ID
 */
export async function getUserProfile(
  afreecaId: string
): Promise<{nickname: string; logo: string}> {
  const profileUrl = `https://bjapi.afreecatv.com/api/${afreecaId}/station`;
  const headers = { 'User-Agent': 'Mozilla/5.0' };

  return Axios.get<BJApiAfreecaProfile>(profileUrl, { headers })
    .then((res) => ({
      logo: `https:${res.data.profile_image}`,
      nickname: res.data.station.user_nick,
    }))
    .catch((err) => {
      console.error('Error occurred in getUserProfile - ', err.response.data);
      throw err;
    });
}

export interface User {
  creatorId: string; afreecaId: string; afreecaName: string; afreecaLogo: string;
}
/**
 * 아프리카 연동 정보 업데이트 함수.
 * @param user 아프리카 연동 정보를 업데이트 하고자 하는 유저 객체.
 */
export default async function afreecaUpdate(user: User): Promise<any> {
  // 아프리카 정보 가져오기
  const {
    nickname, logo,
  } = await getUserProfile(user.afreecaId);
  // 변경사항이 있는제 치크하여 유저 정보 업데이트
  const updateQuery = `
  UPDATE creatorInfo_v2
  SET afreecaName = ?, afreecaLogo = ?
  WHERE creatorId = ?`;
  const updateQueryArray = [nickname, logo, user.creatorId];

  return doQuery(updateQuery, updateQueryArray)
    .then((row) => {
      if (row.result.affectedRows > 0) {
        return 'success';
      }
      return 'fail';
    })
    .catch((err) => {
      console.error(`An error occurred in - afreecaUpdate, doQuery ${err}`);
      throw err;
    });
}
