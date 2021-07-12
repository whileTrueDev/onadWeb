import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerLandingUrlConnectedCampaign {
  campaignId: string;
}

const getMarketerLandingUrlConnectedCampaigns = async (linkId: string) => {
  const res = await axios.get<MarketerLandingUrlConnectedCampaign[]>(
    '/marketer/landing-url/campaigns',
    {
      params: { linkId },
    },
  );
  return res.data;
};

export const useMarketerLandingUrlConnectedCampaigns = (linkId: string) => {
  return useQuery(
    ['marketerLandingUrlConnectedCampaigns', linkId],
    () => getMarketerLandingUrlConnectedCampaigns(linkId),
    {
      enabled: !!linkId,
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 10,
    },
  );
};
