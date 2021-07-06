import { useQuery } from 'react-query';
import axios from '../../axios';

export interface IncomeCashRes {
  creatorTotalIncome: number;
  creatorReceivable: number;
  creatorAccountNumber: string;
  date: string;
  creatorContractionAgreement: number;
  realName: string;
  settlementState: number;
}

const getCreatorIncome = async () => {
  return axios.get<IncomeCashRes>('/creator/income').then(res => res.data);
};

export const useCreatorIncome = () => {
  return useQuery('creatorIncome', getCreatorIncome, {
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5분이후 만료로 표시
  });
};
