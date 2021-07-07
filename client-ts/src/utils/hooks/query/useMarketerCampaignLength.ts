import { useQuery } from 'react-query';
import axios from '../../axios';

const getMarketerCampaignLength = async () => {
  return axios.get<number>('/marketer/campaign/length').then(res => res.data);
};

export const useMarketerCampaignLength = () => {
  return useQuery('marketerCampaignLength', getMarketerCampaignLength, {
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });
};
