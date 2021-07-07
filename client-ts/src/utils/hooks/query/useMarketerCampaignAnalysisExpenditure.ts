import { useQuery } from 'react-query';
import axios from '../../axios';

const getMarketerCampaignAnalysisExpenditure = async (campaignId: string) => {
  const res = await axios.get<any>('/marketer/campaign/analysis/v1/expenditure', {
    params: { campaignId },
  });
  return res.data;
};

export const useMarketerCampaignAnalysisExpenditure = (campaignId: string) => {
  return useQuery(
    ['marketerCampaignAnalysisExpenditure', campaignId],
    () => getMarketerCampaignAnalysisExpenditure(campaignId),
    {
      enabled: !!campaignId,
      staleTime: 1000 * 60 * 30,
      cacheTime: 1000 * 60 * 30,
    },
  );
};
