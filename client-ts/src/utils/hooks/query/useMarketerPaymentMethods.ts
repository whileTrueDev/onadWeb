import { useQuery } from 'react-query';
import axios from '../../axios';

export interface PaymentMethods {
  id: number;
  method: string;
  paymentFee: number;
  paymentFeeFixed: number;
}

const getMarketerPaymentMethods = async () => {
  return axios
    .get<PaymentMethods[]>('/marketer/merchandises/payment-methods')
    .then(res => res.data);
};

export const useMarketerPaymentMethods = () => {
  return useQuery('marketerPaymentMethods', getMarketerPaymentMethods, {
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
