import { useQuery } from 'react-query';
import axios from '../../axios';

export interface CashInterface {
  cashAmount: string;
  date: string;
}
const getMarketerCash = async () => {
  return axios.get<CashInterface | null>('/marketer/cash').then(res => res.data);
};

export const useMarketerCash = () => {
  return useQuery('marketerCash', getMarketerCash, {
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
