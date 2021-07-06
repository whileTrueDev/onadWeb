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
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
