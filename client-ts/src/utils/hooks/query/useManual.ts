import { useQuery } from 'react-query';
import axios from '../../axios';

export type CreatorOrMarketerParams = 'creator' | 'marketer';

export interface Manual {
  title: string;
  subTitle: string;
  contents: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

const getManual = async (type: CreatorOrMarketerParams) => {
  const res = await axios.get<Manual[]>('/manual', { params: { type } });
  return res.data;
};

export const useManual = (type: CreatorOrMarketerParams) => {
  return useQuery(['manuals', type], () => getManual(type), {
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
