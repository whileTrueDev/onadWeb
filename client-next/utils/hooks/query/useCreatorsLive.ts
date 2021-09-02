import { useQuery } from 'react-query';
import axios from '../../axios';

const getCreatorsLive = async () => {
  return axios.get<string[]>('/creators/live').then(res => res.data);
};

export const useCreatorsLive = (initialData: any) => {
  return useQuery('creatorsLive', getCreatorsLive, {
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60 * 1,
    initialData,
  });
};
