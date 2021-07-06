import { useQuery } from 'react-query';
import axios from '../../axios';

export type MarketerSettlementLogParams = {
  year?: string | null;
  month?: string | null;
};

const getMarketerSettlementLogRounds = async (params: MarketerSettlementLogParams) => {
  const { year, month } = params;
  return axios
    .get<string[]>('/marketer/settlement/logs/rounds', { params: { year, month } })
    .then(res => res.data);
};

export const useMarketerSettlementLogRounds = (params: MarketerSettlementLogParams) => {
  return useQuery(
    ['marketerSettlementLogRounds', params.year, params.month],
    () => getMarketerSettlementLogRounds(params),
    {
      enabled: !!(params.year && params.month),
      // staleTime 1일
      staleTime: 1000 * 60 * 60 * 24,
      cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
    },
  );
};
