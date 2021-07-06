import { useQuery } from 'react-query';
import axios from '../../axios';

const getMarketerSettlementLogMonths = async (year?: string | null) => {
  return axios
    .get<string[]>('/marketer/settlement/logs/months', { params: { year } })
    .then(res => res.data);
};

export const useMarketerSettlementLogMonths = (year?: string | null) => {
  return useQuery(
    ['marketerSettlementLogMonths', year],
    () => getMarketerSettlementLogMonths(year),
    {
      enabled: !!year,
      // staleTime 1일
      staleTime: 1000 * 60 * 60 * 24,
      cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
    },
  );
};
