import { useQuery } from 'react-query';
import axios from '../../axios';

export interface AccountInterface {
  marketerAccountNumber: string;
  accountHolder: string;
}
const getMarketerAccount = async () => {
  return axios.get<AccountInterface | null>('/marketer/account').then(res => res.data);
};

export const useMarketerAccount = () => {
  return useQuery('marketerAccount', getMarketerAccount, {
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
