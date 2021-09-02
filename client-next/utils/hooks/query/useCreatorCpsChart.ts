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
    staleTime: 1000 * 60 * 20, // 20 분이후 만료로 표시
    cacheTime: 1000 * 60 * 20, // 캐시 20분간 유효
    refetchOnWindowFocus: true,
  });
};
