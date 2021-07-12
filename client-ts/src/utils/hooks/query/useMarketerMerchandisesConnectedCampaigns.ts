import { useQuery } from 'react-query';
import axios from '../../axios';

const getMarketerMerchandisesConnectedCampaigns = async (id: number) => {
  const res = await axios.get<number>('/marketer/merchandises/campaigns', {
    params: { id },
  });
  return res.data;
};

export const useMarketerMerchandisesConnectedCampaigns = (id: number) => {
  return useQuery(
    ['marketerMerchandisesConnectedCampaigns', id],
    () => getMarketerMerchandisesConnectedCampaigns(id),
    {
      enabled: !!id,
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 10,
    },
  );
};
