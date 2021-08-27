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
    staleTime: 1000 * 60 * 20, // 20 분이후 만료로 표시
    cacheTime: 1000 * 60 * 20, // 캐시 20분간 유효
    refetchOnWindowFocus: true,
  });
};
