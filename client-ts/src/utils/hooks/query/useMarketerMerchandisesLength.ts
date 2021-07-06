import { useQuery } from 'react-query';
import axios from '../../axios';

const getMarketerMerchandisesLength = async () => {
  return axios.get<number>('/marketer/merchandises/length').then(res => res.data);
};

export const useMarketerMerchandisesLength = () => {
  return useQuery('marketerMerchandisesLength', getMarketerMerchandisesLength, {
    // staleTime 10분
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10, // 캐시 10 분 유지
  });
};
