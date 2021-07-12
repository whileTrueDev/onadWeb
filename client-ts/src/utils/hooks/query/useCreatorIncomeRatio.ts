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
    staleTime: 1000 * 60 * 30, // 30분이후 만료된데이터로 표시
    cacheTime: 1000 * 60 * 60, // 캐시 60분유지
  });
};
