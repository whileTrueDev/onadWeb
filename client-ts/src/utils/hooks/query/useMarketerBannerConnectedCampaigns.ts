import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerBannerConnectedCampaign {
  campaignId: string;
}

const getMarketerBannerConnectedCampaigns = async (bannerId: string) => {
  const res = await axios.get<MarketerBannerConnectedCampaign[]>('/marketer/banner/campaigns', {
    params: { bannerId },
  });
  return res.data;
};

export const useMarketerBannerConnectedCampaigns = (bannerId: string) => {
  return useQuery(
    ['marketerBannerConnectedCampaigns', bannerId],
    () => getMarketerBannerConnectedCampaigns(bannerId),
    {
      enabled: !!bannerId,
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 10,
    },
  );
};
