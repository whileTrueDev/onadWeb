import { useQuery } from 'react-query';
import axios from '../../axios';

export interface marketerCampaignActive {
  activeCampaignCount: number;
}

const getMarketerCampaignActive = async () => {
  return axios.get<marketerCampaignActive>('/marketer/campaign/active').then(res => res.data);
};

export const useMarketerCampaignActive = () => {
  return useQuery('marketerCampaignActive', getMarketerCampaignActive, {
    // staleTime 10분
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10, // 캐시 10 분 유지
  });
};
