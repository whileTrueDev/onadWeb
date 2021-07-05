import { useQuery } from 'react-query';
import axios from '../../axios';

export interface CurrentBannerRes {
  marketerName: string;
  bannerSrc: string;
  campaignName: string;
  campaignDescription: string;
  links: string;
  regiDate: string;
  profileImage?: string;
  date: string;
  merchandiseName?: string;
  itemSiteUrl?: string;
}

const getCreatorBannerActive = async () => {
  const res = await axios.get<CurrentBannerRes[]>('/creator/banner/active');
  return res.data;
};

export const useCreatorBannerActive = () => {
  return useQuery('creatorBannerActive', getCreatorBannerActive, {
    // staleTime 1 분
    staleTime: 1000 * 60,
  });
};
