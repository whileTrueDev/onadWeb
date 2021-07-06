import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerBusiness {
  marketerBusinessRegNum: string;
  marketerBusinessRegSrc: string;
}

const getMarketerBusiness = async () => {
  return axios.get<MarketerBusiness | null>('/marketer/business').then(res => res.data);
};

export const useMarketerBusiness = () => {
  return useQuery('marketerBusiness', getMarketerBusiness, {
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
