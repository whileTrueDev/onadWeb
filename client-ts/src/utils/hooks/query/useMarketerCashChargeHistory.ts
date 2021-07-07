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
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });
};
