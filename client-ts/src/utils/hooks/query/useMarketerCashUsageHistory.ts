import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerCashUsageHistory {
  data: string[][];
}
const getMarketerCashUsageHistory = async () => {
  return axios.get<MarketerCashUsageHistory>('/marketer/cash/history/usage').then(res => res.data);
};

export const useMarketerCashUsageHistory = () => {
  return useQuery('marketerCashUsageHistory', getMarketerCashUsageHistory, {
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
