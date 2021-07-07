import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerAdAnalysisExpenditure {
  date: string;
  value: number;
  type: string; // 'CPM' | 'CPC';
}

const getMarketerAdAnalysisExpenditure = async () => {
  return axios
    .get<MarketerAdAnalysisExpenditure[]>('/marketer/ad/analysis/expenditure')
    .then(res => res.data);
};

export const useMarketerAdAnalysisExpenditure = () => {
  return useQuery('marketerAdAnalysisExpenditure', getMarketerAdAnalysisExpenditure, {
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};
