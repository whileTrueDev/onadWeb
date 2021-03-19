import { OnadAddressData } from '../shared/sub/MerchandiseAddressInput';

export interface BannerDataInterface {
  id: string;
  bannerId: string;
  bannerSrc: string;
  confirmState: number;
  bannerDenialReason: string;
  date: string;
  regiDate: string;
}

export interface UrlLink {
  primary: boolean;
  linkName: string;
  linkTo: string;
}
export interface UrlLinks {
  links: UrlLink[];
}
export interface UrlDataInterface {
  id: string;
  linkId: string;
  marketerId: string;
  confirmState: number;
  denialReason: string;
  links: UrlLinks;
  regiDate: string;
  updateDate: Date;
}
export interface Merchandise {
  id: number;
  name: string;
  price: number;
  stock: number;
  optionFlag?: boolean;
  description: string;
  images: MerchandiseImage[];
  pickupFlag?: boolean;
  pickupAddress?: MerchandisePickupAddress;
  createDate?: Date;
  updateDate?: Date;
  mallUploadFlag?: boolean;
  imagesRes?: string[];
  options?: MerchandiseOption[];
  soldCount?: number;
  uploadState?: number;
  itemSiteUrl?: string;
}

export interface MerchandisePickupAddress {
  roadAddress: string; // 도로명 주소
  roadAddressEnglish: string; // 도로명 영어 주소
  roadAddressDetail?: string; // 사용자 입력 상세 주소
  jibunAddress: string; // 지번 주소
  jibunAddressEnglish: string; // 지번 영어 주소
  buildingCode: string; // 건물 코드
  sido: string; // 시/도
  sigungu: string; // 시군구 이름
  sigunguCode: string; // 시군구 코드
  bname: string; // 법정동 이름
  bCode: string; // 법정동 코드
  roadname: string; // 도로명
  roadnameCode: string; // 도로명코드
  zoneCode: string; // 우편번호
}
export interface MerchandiseImage {
  imageFile: File; // 이미지 파일
  imageBase64: string; // 이미지 베이스64 인코딩 문자열
  imageName: string; // 이미지명
}
export interface MerchandiseOption {
  id?: number;
  type: string; // 옵션 타입
  name: string; // 옵션 값
  additionalPrice: string; // 옵션 추가 금액
}
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
  status: number;
  orderPrice: number;
  ordererName: string;
  recipientName: string;
  quantity: number;
  createDate: string;
  name: string;
  price: number;
  stock: number;
  optionFlag: boolean;
  optionType?: string;
  optionValue?: string;
  additionalPrice?: number;
  merchandiseSoldCount?: number;
}
