import { useQuery } from 'react-query';
import axios from '../../axios';

interface MarketerCashUsageHistoryMonth {
  data: string[][];
  metaData: { type: string; cash: string }[];
}
const getMarketerCashUsageHistoryMonth = async (month: string) => {
  return axios
    .get<MarketerCashUsageHistoryMonth>('/marketer/cash/history/usage/month', {
      params: { month },
    })
    .then(res => res.data);
};

export const useMarketerCashUsageHistoryMonth = (month: string) => {
  return useQuery(
    ['marketerCashUsageHistoryMonth', month],
    () => getMarketerCashUsageHistoryMonth(month),
    {
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 10,
    },
  );
};
