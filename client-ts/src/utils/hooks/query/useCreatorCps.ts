import { useQuery } from 'react-query';
import axios from '../../axios';

export interface CpsMetaInfoRes {
  income: number;
  salesCount: number;
  clickCount: number;
}

const getCreatorCPS = async () => {
  return axios.get<CpsMetaInfoRes>('/creator/cps').then(res => res.data);
};

export const useCreatorCPS = () => {
  return useQuery('creatorCPS', getCreatorCPS, {
    // staleTime 10 분
    staleTime: 1000 * 60 * 10,
  });
};
