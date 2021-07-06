import { useQuery } from 'react-query';
import axios from '../../axios';

const getCreatorBannerStartCheck = async () => {
  const res = await axios.get<string>('/creator/banner/start-check');
  return res.data;
};

export const useCreatorBannerStartCheck = () => {
  return useQuery('creatorBannerStartCheck', getCreatorBannerStartCheck, {
    staleTime: 1000 * 60 * 30, // 30분 이후 만료로 표시
    cacheTime: 1000 * 60 * 60, // 60분 동안 캐시 유지
  });
};
