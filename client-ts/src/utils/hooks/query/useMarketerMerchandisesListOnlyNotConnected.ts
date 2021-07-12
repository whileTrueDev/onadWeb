import { useQuery } from 'react-query';
import axios from '../../axios';
import { Merchandise } from './useMarketerMerchandisesList';

const getMarketerMerchandisesListOnlyNotConnected = async () => {
  return axios.get<Merchandise[]>('/marketer/merchandises').then(res => res.data);
};

export const useMarketerMerchandisesListOnlyNotConnected = () => {
  return useQuery(
    'marketerMerchandisesListOnlyNotConnected',
    getMarketerMerchandisesListOnlyNotConnected,
    {
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 10,
    },
  );
};
