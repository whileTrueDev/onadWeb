import { useQuery } from 'react-query';
import axios from '../../axios';

export interface CreatorProfile {
  loginId: string;
  creatorId: string;
  creatorName: string;
  creatorIp: string;
  creatorMail: string;
  creatorAccountNumber: string;
  creatorContractionAgreement: number;
  creatorTwitchId: string;
  creatorTwitchOriginalId: string;
  afreecaId?: string;
  afreecaName?: string;
  afreecaLogo?: string;
  afreecaRefreshToken?: string;
  realName: string;
  creatorLogo: string;
  NowIp: string;
  settlementState: number;
  identificationNumber: string;
  name: string;
  phoneNumber: string;
  creatorType: number;
  identificationImg: string;
  AccountImg: string;
  BussinessRegiImg: string;
}

export const getCreatorProfile = async () => {
  const res = await axios.get<CreatorProfile>('/creator');
  return res.data;
};

export const useCreatorProfile = () => {
  return useQuery('creatorProfile', getCreatorProfile, {
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};
