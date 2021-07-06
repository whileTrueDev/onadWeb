import { useQuery } from 'react-query';
import axios from '../../axios';

export interface WithdrawalRes {
  date: string;
  creatorWithdrawalAmount: number;
  withdrawalState: number;
}
const getCreatorIncomeWithdrawal = async () => {
  const res = await axios.get<WithdrawalRes[]>('/creator/income/withdrawal');
  return res.data;
};

export const useCreatorIncomeWithdrawal = () => {
  return useQuery('creatorIncomeWithdrawal', getCreatorIncomeWithdrawal, {
    staleTime: 1000 * 60 * 5, // 5분이후 만료로 표시
  });
};
