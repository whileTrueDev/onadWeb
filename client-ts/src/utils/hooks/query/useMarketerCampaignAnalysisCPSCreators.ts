import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerCampaignAnalysisExpenditureCPS {
  date: string;
  value: number;
  type: string; // 'CPM' | 'CPC';
}

const getMarketerCampaignAnalysisCPSCreators = async (campaignId: string) => {
  const res = await axios.get<MarketerCampaignAnalysisExpenditureCPS[]>(
    '/marketer/campaign/analysis/cps/creators',
    {
      params: { campaignId },
    },
  );
  return res.data;
};

export const useMarketerCampaignAnalysisCPSCreators = (campaignId: string) => {
  return useQuery(
    ['marketerCampaignAnalysisCPSCreators', campaignId],
    () => getMarketerCampaignAnalysisCPSCreators(campaignId),
    {
      enabled: !!campaignId,
      staleTime: 1000 * 60 * 30,
      cacheTime: 1000 * 60 * 30,
    },
  );
};
