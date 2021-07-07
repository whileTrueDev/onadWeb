import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerBannerActive {
  bannerId: string;
  bannerSrc: string;
}
const getMarketerBannerListActive = async () => {
  return axios.get<MarketerBannerActive[]>('/marketer/banner/list/active').then(res => res.data);
};

export const useMarketerBannerListActive = () => {
  return useQuery('marketerBannerListActive', getMarketerBannerListActive, {
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });
};
