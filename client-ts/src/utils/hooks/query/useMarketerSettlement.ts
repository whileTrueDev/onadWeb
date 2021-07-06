import { useQuery } from 'react-query';
import axios from '../../axios';

export type SalesIncomeSettlement = Array<string>;
export interface MarketerSettlement {
  id: number;
  marketerId: string;
  name: string;
  identificationNumber: string;
  bankName: string;
  bankAccountOwner: string;
  bankAccountNumber: string;
  state: number;
  businessmanFlag: boolean;
  identificationImgSrc: string;
  bankAccountImgSrc: string;
  createDate: string;
  updateDate: string;
}

const getMarketerSettlement = async () => {
  return axios.get<MarketerSettlement>('/marketer/settlement').then(res => res.data);
};

export const useMarketerSettlement = () => {
  return useQuery('marketerSettlement', getMarketerSettlement, {
    // staleTime 1일
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24, // 캐시 24시간 유지
  });
};
