import { useQuery } from 'react-query';
import axios from '../../axios';

const getMarketerBannerLength = async () => {
  return axios.get<number>('/marketer/banner/length').then(res => res.data);
};

export const useMarketerBannerLength = () => {
  return useQuery('marketerBannerLength', getMarketerBannerLength, {
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });
};
