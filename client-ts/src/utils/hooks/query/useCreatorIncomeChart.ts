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
    // staleTime 1시간
    staleTime: 1000 * 60 * 60,
  });
};
