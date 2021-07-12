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
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2, // 2분 이후 만료된 데이터료 표시
    cacheTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};
