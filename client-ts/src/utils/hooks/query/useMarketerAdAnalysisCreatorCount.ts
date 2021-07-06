import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerAdAnalysisCreatorCount {
  counts: number;
}

const getMarketerAdAnalysisCreatorCount = async () => {
  return axios
    .get<MarketerAdAnalysisCreatorCount>('/marketer/ad/analysis/creator-count')
    .then(res => res.data);
};

export const useMarketerAdAnalysisCreatorCount = () => {
  return useQuery('marketerAdAnalysisCreatorCount', getMarketerAdAnalysisCreatorCount, {
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
