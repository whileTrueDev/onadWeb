import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerInfo {
  marketerId: string;
  marketerName: string;
  marketerMail: string;
  marketerPhoneNum: string;
  marketerBusinessRegNum: string;
  marketerContraction: number;
  platformType: number;
  profileImage?: string;
}
const getMarketerProfile = async () => {
  return axios.get<MarketerInfo>('/marketer').then(res => res.data);
};

export const useMarketerProfile = () => {
  return useQuery('marketerProfile', getMarketerProfile, {
    // staleTime 10분
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10, // 캐시 10 분 유지
  });
};
