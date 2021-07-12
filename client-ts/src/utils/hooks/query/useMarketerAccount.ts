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
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });
};
