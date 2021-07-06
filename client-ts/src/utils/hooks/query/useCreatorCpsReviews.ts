import { useQuery } from 'react-query';
import axios from '../../axios';

export interface CpsChartData {
  date: string;
  value: number;
  type: 'CPS';
}
const getCreatorCpsReviews = async () => {
  return axios.get<CpsChartData[]>('/creator/cps/reviews').then(res => res.data);
};

export const useCreatorCpsReviews = () => {
  return useQuery('creatorCpsReviews', getCreatorCpsReviews, {
    staleTime: 1000 * 60 * 20, // 20 분이후 만료로 표시
    cacheTime: 1000 * 60 * 20, // 캐시 20분간 유효
    refetchOnWindowFocus: true,
  });
};
