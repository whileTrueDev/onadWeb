import { useQuery } from 'react-query';
import axios from '../../axios';

export type CampaignGeoData = {
  latitude: number;
  longitude: number;
  range: number[];
  country: string;
  region: string;
  city: string;
  ll: number[];
};
const getMarketerCampaignGeoData = async (campaignId: string) => {
  const res = await axios.get<CampaignGeoData[]>('/marketer/geo/campaign', {
    params: { campaignId },
  });
  return res.data;
};

export const useMarketerCampaignGeoData = (campaignId: string) => {
  return useQuery(
    ['marketerCampaignGeoData', campaignId],
    () => getMarketerCampaignGeoData(campaignId),
    {
      enabled: !!campaignId,
      staleTime: 1000 * 60 * 30,
      cacheTime: 1000 * 60 * 30,
    },
  );
};
