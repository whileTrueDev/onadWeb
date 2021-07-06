import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerAd {
  cashAmount: number;
  spendAll: number;
}

const getMarketerAd = async () => {
  return axios.get<MarketerAd | null>('/marketer/ad').then(res => res.data);
};

export const useMarketerAd = () => {
  return useQuery('marketerAd', getMarketerAd, {
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
