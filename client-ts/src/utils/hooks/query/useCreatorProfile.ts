import { useQuery } from 'react-query';
import axios from '../../axios';

export interface ProfileDataType {
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

const getCreatorProfile = async () => {
  const res = await axios.get<ProfileDataType>('/creator');
  return res.data;
};

export const useCreatorProfile = () => {
  return useQuery('creatorProfile', getCreatorProfile);
};
