import { useQuery } from 'react-query';
import axios from '../../axios';
import { OrderStatus, OrderStatusString } from '../../render_funcs/renderOrderStatus';

interface MarketerMerchandisesOrdersParams {
  merchandiseId?: number;
  campaignId?: string;
}

export interface MerchandiseOrder {
  id: string;
  merchandiseId: number;
  campaignId: string;
  optionId: number;
  status: OrderStatus;
  statusString: OrderStatusString;
  orderPrice: number;
  ordererName: string;
  recipientName: string;
  quantity: number;
  createDate: string;
  updateDate: string;
  name: string;
  price: number;
  stock: number;
  optionFlag: boolean;
  optionType?: string;
  optionValue?: string;
  additionalPrice?: number;
  merchandiseSoldCount?: number;
  email: string;
  phone: string;
  zoneCode: string;
  roadAddress: string;
  jibunAddress: string;
  deliveryMemo?: string;
  releaseId?: string;
  courierCompany?: string;
  trackingNumber?: string;
  denialReason?: string;
}

const getMarketerMerchandisesOrders = async (params: MarketerMerchandisesOrdersParams) => {
  return axios.get<MerchandiseOrder[]>('/marketer/orders', { params }).then(res => res.data);
};

export const useMarketerMerchandisesOrders = (params: MarketerMerchandisesOrdersParams) => {
  return useQuery(
    ['marketerMerchandisesOrders', params.campaignId, params.merchandiseId],
    () => getMarketerMerchandisesOrders(params),
    {
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 10,
    },
  );
};
