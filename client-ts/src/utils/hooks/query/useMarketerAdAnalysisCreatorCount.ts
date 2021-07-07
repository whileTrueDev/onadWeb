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
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};
