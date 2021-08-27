import { useQuery } from 'react-query';
import axios from '../../axios';
import { Merchandise } from './useMarketerMerchandisesList';

const getMarketerMerchandisesDetail = async (merchandiseId: number) => {
  return axios.get<Merchandise>(`/marketer/merchandises/${merchandiseId}`).then(res => res.data);
};

export const useMarketerMerchandisesDetail = (merchandiseId: number) => {
  return useQuery(
    ['marketerMerchandisesDetail', merchandiseId],
    () => getMarketerMerchandisesDetail(merchandiseId),
    {
      enabled: !!merchandiseId,
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 10,
    },
  );
};
