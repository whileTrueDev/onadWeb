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
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });
};
