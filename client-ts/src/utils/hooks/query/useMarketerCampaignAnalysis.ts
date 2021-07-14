import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerCampaignAnalysis {
  campaignName: string;
  totalCPM: number;
  totalViewCount: number;
  totalCPC: number;
  adchatClick: number;
  adpanelClick: number;
}
const getMarketerCampaignAnalysis = async (campaignId: string) => {
  const res = await axios.get<MarketerCampaignAnalysis>('/marketer/campaign/analysis', {
    params: { campaignId },
  });
  return res.data;
};

export const useMarketerCampaignAnalysis = (campaignId: string) => {
  return useQuery(
    ['marketerCampaignAnalysis', campaignId],
    () => getMarketerCampaignAnalysis(campaignId),
    {
      enabled: !!campaignId,
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 10,
    },
  );
};
