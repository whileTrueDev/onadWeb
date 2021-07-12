import { useQuery } from 'react-query';
import axios from '../../axios';
import { MarketerCampaign } from './useMarketerCampaignList';

const getMarketerCampaign = async (campaignId: string) => {
  return axios
    .get<MarketerCampaign>('/marketer/campaign', { params: { campaignId } })
    .then(res => res.data);
};

export const useMarketerCampaign = (campaignId: string) => {
  return useQuery(['marketerCampaign', campaignId], () => getMarketerCampaign(campaignId), {
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });
};
