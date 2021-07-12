import { useQuery } from 'react-query';
import axios from '../../axios';

const getMarketerCampaignNames = async () => {
  return axios.get<string[]>('/marketer/campaign/names').then(res => res.data);
};

export const useMarketerCampaignNames = () => {
  return useQuery('marketerCampaignNames', getMarketerCampaignNames, {
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });
};
