export interface FindOrdersResObject {
  id: number;
  merchandiseId: number;
  campaignId: string;
  optionId: number;
  status: number;
  statusString: string;
  orderPrice: number;
  ordererName: string;
  recipientName: string;
  quantity: number;
  createDate: string;
  updateDate: string;
  denialReason: null;
  deliveryMemo: string;
  email: string;
  jibunAddress: string;
  roadAddress: string;
  zoneCode: string;
  phone: string;
  name: string;
  price: number;
  stock: number;
  optionFlag: number;
  optionType: string;
  optionValue: string;
  additionalPrice: number;
  merchandiseSoldCount: number;
  releaseId: number;
  courierCompany: string;
  trackingNumber: string;
}

export type FindOrdersRes = FindOrdersResObject[];
