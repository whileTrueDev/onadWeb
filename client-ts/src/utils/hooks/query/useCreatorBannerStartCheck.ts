import { useQuery } from 'react-query';
import axios from '../../axios';

const getCreatorClickStartCheck = async () => {
  const res = await axios.get<string>('/creator/clicks/start-check');
  return res.data;
};

export const useCreatorClickStartCheck = () => {
  return useQuery('creatorClickStartCheck', getCreatorClickStartCheck, {
    // staleTime 15일
    staleTime: 1000 * 60 * 60 * 24 * 15,
  });
};
