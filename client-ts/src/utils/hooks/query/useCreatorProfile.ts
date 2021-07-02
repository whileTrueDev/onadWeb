import { useQuery } from 'react-query';
import type { ProfileDataType } from '../../../organisms/mypage/creator/Mypage/ProfileData.type';
import axios from '../../axios';

const getCreatorProfile = async () => {
  const res = await axios.get<ProfileDataType>('/creator');
  return res.data;
};

export const useCreatorProfile = () => {
  return useQuery('creatorProfile', getCreatorProfile, {
    // staleTime: 1000 * 60 * 5, // 5분 = 1000 밀리초 * 60 * 5
  });
};
