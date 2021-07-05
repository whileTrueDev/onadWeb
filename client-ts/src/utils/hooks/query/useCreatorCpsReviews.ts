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
    // staleTime 10 분
    staleTime: 1000 * 60 * 10,
  });
};
