import { useQuery } from 'react-query';
import axios from '../../axios';
import { MarketerLandingUrl } from './useMarketerLandingUrlList';

const getMarketerLandingUrlListWithoutPagination = async () => {
  return axios.get<MarketerLandingUrl[]>('/marketer/landing-url/list').then(res => res.data);
};

export const useMarketerLandingUrlListWithoutPagination = () => {
  return useQuery(
    'marketerLandingUrlListWithoutPagination',
    getMarketerLandingUrlListWithoutPagination,
    {
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 10,
    },
  );
};
