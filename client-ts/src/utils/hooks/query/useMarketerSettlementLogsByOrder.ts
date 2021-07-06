import { useQuery } from 'react-query';
import axios from '../../axios';

interface MarketerSettlementLogsByOrderParams {
  year?: string | null;
  month?: string | null;
  roundInMonth?: string | null;
}

export interface SettlementByOrderData {
  VAT: number;
  actualSendedAmount: number;
  bigo: string;
  campaignId: string;
  campaignName: string;
  commissionAmount: number;
  deliveryFee: number;
  id: number;
  orderId: number;
  orderPrice: number;
  paymentCommissionAmount: number;
  paymentMethod: string;
  purchaseChannel: string;
  settlementLogId: number;
  createDate: Date;
  orderDate: Date;
  cancelDate: Date | null;
  purchaseConfirmDate: Date;
  updateDate: Date;
  isLiveCommerce: number;
}

const getMarketerSettlementLogsByOrder = async (params: MarketerSettlementLogsByOrderParams) => {
  return axios
    .get<SettlementByOrderData[]>('/marketer/settlement/logs', {
      params,
    })
    .then(res => res.data);
};

export const useMarketerSettlementLogsByOrder = (params: MarketerSettlementLogsByOrderParams) => {
  const { year, month, roundInMonth } = params;
  return useQuery(
    ['marketerSettlementLogsByOrder', year, month, roundInMonth],
    () => getMarketerSettlementLogsByOrder(params),
    {
      enabled: !!(year && month && roundInMonth),
      // staleTime 1일
      staleTime: 1000 * 60 * 60 * 24,
      cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
    },
  );
};
