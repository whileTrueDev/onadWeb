import { useQuery } from 'react-query';
import axios from '../../axios';

const getMarketerSettlementLogYears = async () => {
  return axios.get<string[]>('/marketer/settlement/logs/years').then(res => res.data);
};

export const useMarketerSettlementLogYears = () => {
  return useQuery('marketerSettlementLogYears', getMarketerSettlementLogYears, {
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24,
  });
};
