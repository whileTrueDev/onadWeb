import { useQuery } from 'react-query';
import axios from '../../axios';

const getMarketerTaxBills = async () => {
  return axios.get<string[][]>('/marketer/tax-bills').then(res => res.data);
};

export const useMarketerTaxBills = () => {
  return useQuery('marketerTaxBills', getMarketerTaxBills, {
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
