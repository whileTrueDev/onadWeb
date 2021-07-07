import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerCampaignAnalysisExpenditureCPS {
  date: string;
  value: number;
  type: string; // 'CPM' | 'CPC';
}

const getMarketerCampaignAnalysisCPSChart = async (campaignId: string) => {
  const res = await axios.get<MarketerCampaignAnalysisExpenditureCPS[]>(
    '/marketer/campaign/analysis/cps/chart',
    {
      params: { campaignId },
    },
  );
  return res.data;
};

export const useMarketerCampaignAnalysisCPSChart = (campaignId: string) => {
  return useQuery(
    ['marketerCampaignAnalysisCPSChart', campaignId],
    () => getMarketerCampaignAnalysisCPSChart(campaignId),
    {
      enabled: !!campaignId,
      staleTime: 1000 * 60 * 30,
      cacheTime: 1000 * 60 * 30,
    },
  );
};
