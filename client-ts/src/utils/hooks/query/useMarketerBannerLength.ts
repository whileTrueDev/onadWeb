import { useQuery } from 'react-query';
import axios from '../../axios';

const getMarketerBannerLength = async () => {
  return axios.get<number>('/marketer/banner/length').then(res => res.data);
};

export const useMarketerBannerLength = () => {
  return useQuery('marketerBannerLength', getMarketerBannerLength, {
    // staleTime 10분
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10, // 캐시 10 분 유지
  });
};
