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
    staleTime: 1000 * 60 * 30, // mark as expired after 30 minute
    cacheTime: 1000 * 60 * 60, // garbage collected after 1 hour
  });
};
