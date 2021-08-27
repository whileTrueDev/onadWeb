import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerCampaignAnalysisCreatorData {
  id: string;
  creatorId: string;
  // twitch information
  creatorTwitchName?: string;
  creatorTwitchId?: string;
  creatorLogo?: string;
  // afreeca information
  afreecaId?: string;
  afreecaName?: string;
  afreecaLogo?: string;

  total_ad_exposure_amount: number;
  recentDate: string;
  viewer?: number;
  followers?: number;
  airtime?: number;
  impression?: number;
  openHour?: number;
  content?: number;
  ctr?: number;
  contentsGraphData?: string;
  contentsGraphDataAfreeca?: string;
  timeGraphData?: string;
  timeGraphDataAfreeca?: string;
  viewerAfreeca?: number;
  ctrAfreeca?: number;
  followersAfreeca?: number;
  airtimeAfreeca?: number;
  impressionAfreeca?: number;
  openHourAfreeca?: number;
  contentAfreeca?: number;
}

const getMarketerCampaignAnalysisCreatorData = async (campaignId: string) => {
  const res = await axios.get<MarketerCampaignAnalysisCreatorData[]>(
    '/marketer/campaign/analysis/creator-data',
    {
      params: { campaignId },
    },
  );
  return res.data;
};

export const useMarketerCampaignAnalysisCreatorData = (campaignId: string) => {
  return useQuery(
    ['marketerCampaignAnalysisCreatorData', campaignId],
    () => getMarketerCampaignAnalysisCreatorData(campaignId),
    {
      enabled: !!campaignId,
      staleTime: 1000 * 60 * 30,
      cacheTime: 1000 * 60 * 30,
    },
  );
};
