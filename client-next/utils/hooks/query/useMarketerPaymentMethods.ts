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
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });
};
