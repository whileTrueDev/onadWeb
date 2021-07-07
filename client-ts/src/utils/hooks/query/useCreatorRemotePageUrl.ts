import { useQuery } from 'react-query';
import axios from '../../axios';

const getCreatorRemotePageUrl = async () => {
  const res = await axios.get<string>('/creator/remote/page-url');
  return res.data;
};

export const useCreatorRemotePageUrl = () => {
  return useQuery('creatorRemotePageUrl', getCreatorRemotePageUrl, {
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 1일 유지
  });
};
