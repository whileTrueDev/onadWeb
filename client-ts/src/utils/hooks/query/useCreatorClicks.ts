import { useQuery } from 'react-query';
import axios from '../../axios';

export type ClicksRes = number;

const getCreatorClicks = async () => {
  const res = await axios.get<ClicksRes>('/creator/clicks');
  return res.data;
};

export const useCreatorClicks = () => {
  return useQuery('creatorClicks', getCreatorClicks, {
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2, // 2분 이후 만료된 데이터료 표시
    cacheTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};
