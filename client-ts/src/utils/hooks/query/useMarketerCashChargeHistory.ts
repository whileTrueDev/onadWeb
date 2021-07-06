import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerCashChargeHistory {
  data: string[][];
}
const getMarketerCashChargeHistory = async () => {
  return axios
    .get<MarketerCashChargeHistory>('/marketer/cash/history/charge')
    .then(res => res.data);
};

export const useMarketerCashChargeHistory = () => {
  return useQuery('marketerCashChargeHistory', getMarketerCashChargeHistory, {
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
