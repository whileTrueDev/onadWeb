import { useQuery } from 'react-query';
import axios from '../../axios';

export interface IncomeRatio {
  creatorId: string;
  type: 'CPM' | 'CPC' | 'CPA';
  cashAmount: number;
}
const getCreatorIncomeRatio = async () => {
  const res = await axios.get<IncomeRatio[]>('/creator/income/ratio');
  return res.data;
};

export const useCreatorIncomeRatio = () => {
  return useQuery('creatorIncomeRatio', getCreatorIncomeRatio, {
    // staleTime 1시간
    staleTime: 1000 * 60 * 60,
  });
};
