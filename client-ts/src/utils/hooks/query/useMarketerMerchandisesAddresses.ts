import { useQuery } from 'react-query';
import axios from '../../axios';

export interface OnadAddressData {
  id?: number;
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

const getMarketerMerchandisesAddresses = async () => {
  return axios.get<OnadAddressData[]>('/marketer/merchandises/addresses').then(res => res.data);
};

export const useMarketerMerchandisesAddresses = () => {
  return useQuery('marketerMerchandisesAddresses', getMarketerMerchandisesAddresses, {
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });
};
