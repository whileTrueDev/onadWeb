import { useQuery } from 'react-query';
import axios from '../../axios';
import { MarketerCampaignAnalysisCreatorData } from './useMarketerCampaignAnalysisCreatorData';

const getMarketerCampaignAnalysisCreatorDataWithoutCampaignId = async () => {
  const res = await axios.get<MarketerCampaignAnalysisCreatorData[]>(
    '/marketer/campaign/analysis/creator-data',
  );
  return res.data;
};

export const useMarketerCampaignAnalysisCreatorDataWithoutCampaignId = () => {
  return useQuery(
    'marketerCampaignAnalysisCreatorDataWithoutCampaignId',
    getMarketerCampaignAnalysisCreatorDataWithoutCampaignId,
    {
      staleTime: 1000 * 60 * 30,
      cacheTime: 1000 * 60 * 30,
    },
  );
};
