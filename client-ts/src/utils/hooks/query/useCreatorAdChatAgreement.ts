import { useQuery } from 'react-query';
import axios from '../../axios';

export interface AdChatRes {
  adChatAgreement: 1 | 0;
}

const getCreatorAdchatAgreement = async () => {
  const res = await axios.get<AdChatRes>('/creator/adchat/agreement');
  return res.data;
};

export const useCreatorAdchatAgreement = () => {
  return useQuery('creatorAdchatAgreement', getCreatorAdchatAgreement, {
    // staleTime 하루
    staleTime: 1000 * 60 * 60 * 24,
  });
};
