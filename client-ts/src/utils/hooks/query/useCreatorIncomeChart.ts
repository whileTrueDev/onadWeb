import { useQuery } from 'react-query';
import axios from '../../axios';

export interface ChartDataBase {
  value: number;
  type: string;
  date: string; // dateString
}

const getCreatorIncomeChart = async () => {
  const res = await axios.get<ChartDataBase[]>('/creator/income/chart', {
    params: { dateRange: '30' },
  });
  return res.data;
};

export const useCreatorIncomeChart = () => {
  return useQuery('creatorIncomeChart', getCreatorIncomeChart, {
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 3, // 2분이후 만료로 표시
  });
};
