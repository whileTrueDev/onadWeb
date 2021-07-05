import { useQuery } from 'react-query';
import axios from '../../axios';

export interface ReferralCodeRes {
  referralCode: string;
  createdAt: string;
  calculateState?: number; // 0, 1, 2
  calculatedAt?: string;
  creatorName?: string;
  afreecaName?: string;
  loginId?: string;
  creatorContractionAgreement: number; // 0, 1
}
const getCreatorReferralCode = async () => {
  const res = await axios.get<ReferralCodeRes>('/creator/referral-code/my');
  return res.data;
};

export const useCreatorReferralCode = () => {
  return useQuery('creatorReferralCode', getCreatorReferralCode, {
    // staleTime 15일
    staleTime: 1000 * 60 * 60 * 24 * 15,
  });
};
