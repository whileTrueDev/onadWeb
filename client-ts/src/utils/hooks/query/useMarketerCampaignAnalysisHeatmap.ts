import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerCampaignAnalysisHeatmap {
  date: string;
  count: number;
}

const getMarketerCampaignAnalysisHeatmap = async (campaignId: string) => {
  const res = await axios.get<MarketerCampaignAnalysisHeatmap[]>(
    '/marketer/campaign/analysis/heatmap',
    {
      params: { campaignId },
    },
  );
  return res.data;
};

export const useMarketerCampaignAnalysisHeatmap = (campaignId: string) => {
  return useQuery(
    ['marketerCampaignAnalysisHeatmap', campaignId],
    () => getMarketerCampaignAnalysisHeatmap(campaignId),
    {
      enabled: !!campaignId,
      staleTime: 1000 * 60 * 30,
      cacheTime: 1000 * 60 * 30,
    },
  );
};
