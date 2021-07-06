import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerAdAnalysisExpenditureCPS {
  date: string;
  value: number;
  type: string; // 'CPM' | 'CPC';
}

const getMarketerAdAnalysisExpenditureCPS = async () => {
  return axios
    .get<MarketerAdAnalysisExpenditureCPS[]>('/marketer/ad/analysis/expenditure/cps')
    .then(res => res.data);
};

export const useMarketerAdAnalysisExpenditureCPS = () => {
  return useQuery('marketerAdAnalysisExpenditureCPS', getMarketerAdAnalysisExpenditureCPS, {
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
