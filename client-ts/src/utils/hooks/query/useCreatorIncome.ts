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
    // staleTime 1 분
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });
};
