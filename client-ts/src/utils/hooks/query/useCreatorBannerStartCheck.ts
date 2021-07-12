import { useQuery } from 'react-query';
import axios from '../../axios';

const getCreatorClickStartCheck = async () => {
  const res = await axios.get<string>('/creator/clicks/start-check');
  return res.data;
};

export const useCreatorClickStartCheck = () => {
  return useQuery('creatorClickStartCheck', getCreatorClickStartCheck, {
    staleTime: 1000 * 60 * 3, // 3분 이후 만료로 표시
    cacheTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
  });
};
