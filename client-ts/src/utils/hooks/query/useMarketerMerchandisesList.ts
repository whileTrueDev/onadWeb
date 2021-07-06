import { useQuery } from 'react-query';
import axios from '../../axios';

export interface Merchandise {
  id: number;
  name: string;
  regularPrice: number;
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

export interface MerchandiseOption {
  id?: number;
  type: string; // 옵션 타입
  name: string; // 옵션 값
  additionalPrice: string; // 옵션 추가 금액
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

export interface MarketerMerchandisesListParams {
  offset: number;
  page: number;
}

const getMarketerMerchandisesList = async (params: MarketerMerchandisesListParams) => {
  return axios.get<Merchandise[]>('/marketer/merchandises', { params }).then(res => res.data);
};

export const useMarketerMerchandisesList = (params: MarketerMerchandisesListParams) => {
  const { page, offset } = params;
  return useQuery(
    ['marketerMerchandisesList', offset, page],
    () => getMarketerMerchandisesList({ page, offset }),
    {
      keepPreviousData: true,
      // staleTime 10분
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 10, // 캐시 10 분 유지
    },
  );
};
