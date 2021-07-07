import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerCashRefundHistory {
  data: string[][];
}
const getMarketerCashRefundHistory = async () => {
  return axios
    .get<MarketerCashRefundHistory>('/marketer/cash/history/refund')
    .then(res => res.data);
};

export const useMarketerCashRefundHistory = () => {
  return useQuery('marketerCashRefundHistory', getMarketerCashRefundHistory, {
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });
};
