import { MerchandiseOption } from '../../../../utils/hooks/query/useMarketerMerchandisesList';
import { OrderStatus, OrderStatusString } from '../../../../utils/render_funcs/renderOrderStatus';
import { OnadAddressData } from '../shared/sub/MerchandiseAddressInput';

export interface CreateMerchandiseDto {
  name: string;
  price: string | number;
  stock: string | number;
  description: string;
  images: string[];
  descImages: string[];
  optionFlag: boolean;
  pickupFlag: boolean;
  pickupAddress?: OnadAddressData;
  options?: MerchandiseOption[];
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
