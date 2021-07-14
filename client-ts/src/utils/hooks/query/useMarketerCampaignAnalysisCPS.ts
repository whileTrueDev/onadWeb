import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerCampaignAnalysisCPS {
  totalSalesIncome: number;
  adchatClick: number;
  adpanelClick: number;
  totalSalesAmount: number;
}

const getMarketerCampaignAnalysisCPS = async (campaignId: string) => {
  const res = await axios.get<MarketerCampaignAnalysisCPS>('/marketer/campaign/analysis/cps', {
    params: { campaignId },
  });
  return res.data;
};

export const useMarketerCampaignAnalysisCPS = (campaignId: string) => {
  return useQuery(
    ['marketerCampaignAnalysisCPS', campaignId],
    () => getMarketerCampaignAnalysisCPS(campaignId),
    {
      enabled: !!campaignId,
      staleTime: 1000 * 60 * 30,
      cacheTime: 1000 * 60 * 30,
    },
  );
};
