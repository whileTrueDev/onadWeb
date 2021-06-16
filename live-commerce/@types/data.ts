export interface UserInfo {
  socketId: string;
  device: string;
}

export interface SocketInfo {
  [key: string]: any[];
}

export interface TextData {
  clientId: string;
  text: string;
}

export interface PurchaseMessage {
  clientId: string;
  text: string;
  icon: string;
  userId: string;
  productName: string;
  purchaseNum: string;
}

export interface ImageData {
  which: string;
  clientId: string;
  imgUrl: string;
}

export interface Data {
  which: string;
  imgUrl: string;
}

export interface SinglePurchase {
  name: string;
  purchaseNumber: number;
}
