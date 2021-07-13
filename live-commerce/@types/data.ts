import { MysqlError } from 'mysql';

export interface UserInfo {
  socketId: string;
  device: string;
}

export interface SocketInfo {
  [key: string]: any[];
}

export interface TextData {
  roomName: string;
  text: string;
}

export interface PurchaseMessage {
  roomName: string;
  text: string;
  icon: string;
  userId: string;
  productName: string;
  purchaseNum: string;
}

export interface ImageData {
  which: string;
  roomName: string;
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

export interface QueryResult {
  error?: MysqlError | null;
  result: any;
}

export interface RankingData {
  nickname:string;
  total:number;
}

export interface AudioEncoding {  
  speakingRate:number;
  audioEncoding: 'MP3' | undefined | null
}

export interface Voice {
  languageCode:string;
  name:string;
  ssmlGender : "FEMALE" | "SSML_VOICE_GENDER_UNSPECIFIED" | "MALE" | "NEUTRAL" | null | undefined
}
