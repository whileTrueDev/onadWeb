import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerSalesIncome {
  id: number;
  marketerId: string;
  totalIncome: number;
  receivable: number;
  totalDeliveryFee: number;
  receivableDeliveryFee: number;
  createDate: string;
}

const getMarketerSalesIncome = async () => {
  return axios.get<MarketerSalesIncome>('/marketer/sales-income').then(res => res.data);
};

export const useMarketerSalesIncome = () => {
  return useQuery('marketerSalesIncome', getMarketerSalesIncome, {
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
