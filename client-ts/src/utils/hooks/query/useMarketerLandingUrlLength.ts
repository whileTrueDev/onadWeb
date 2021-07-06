import { useQuery } from 'react-query';
import axios from '../../axios';

const getMarketerLandingUrlLength = async () => {
  return axios.get<number>('/marketer/landing-url/length').then(res => res.data);
};

export const useMarketerLandingUrlLength = () => {
  return useQuery('marketerLandingUrlLength', getMarketerLandingUrlLength, {
    // staleTime 10분
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10, // 캐시 10 분 유지
  });
};
