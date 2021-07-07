import { useQuery } from 'react-query';
import axios from '../../axios';
import { SalesIncomeSettlement } from './useMarketerSettlement';

const getMarketerSettlementLogs = async (year: string | null) => {
  return axios
    .get<SalesIncomeSettlement[]>('/marketer/settlement/logs', {
      params: { year, month: null },
    })
    .then(res => res.data);
};

export const useMarketerSettlementLogs = (year: string | null) => {
  return useQuery(['marketerSettlementLogs', year], () => getMarketerSettlementLogs(year), {
    enabled: false,
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24,
  });
};
