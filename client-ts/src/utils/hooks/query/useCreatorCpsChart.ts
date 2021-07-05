import { useQuery } from 'react-query';
import axios from '../../axios';

export interface CpsChartData {
  date: string;
  value: number;
  type: 'CPS';
}
const getCreatorCPSChart = async () => {
  return axios.get<CpsChartData[]>('/creator/cps/chart').then(res => res.data);
};

export const useCreatorCPSChart = () => {
  return useQuery('creatorCPSChart', getCreatorCPSChart, {
    // staleTime 10 분
    staleTime: 1000 * 60 * 10,
  });
};
