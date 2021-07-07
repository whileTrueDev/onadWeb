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
export const getMarketerProfile = async () => {
  return axios.get<MarketerInfo>('/marketer').then(res => res.data);
};

export const useMarketerProfile = () => {
  return useQuery('marketerProfile', getMarketerProfile, {
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });
};
