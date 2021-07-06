import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerProfileSocial {
  marketerPlatformData: string;
  marketerMail: string;
}
const getMarketerProfileSocial = async () => {
  return axios.get<MarketerProfileSocial>('/marketer/social').then(res => res.data);
};

export const useMarketerProfileSocial = () => {
  return useQuery('marketerProfileSocial', getMarketerProfileSocial, {
    // staleTime 10분
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10, // 캐시 10 분 유지
  });
};
