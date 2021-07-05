import { useInfiniteQuery } from 'react-query';
import axiosInstance from '../../axios';

export interface CreatorBannerListParams {
  page: number;
}
export interface BannerData {
  campaignId: string;
  date: string;
  bannerSrc: string;
  creatorId: string;
  state: number;
  marketerName: string;
  connectedLinkId: string;
  links: string;
  cash: number;
  CPC: number;
  CPM: number;
  targetList: string; // "{"targetList":["무관"]}"
  campaignDescription: string;
  optionType: number;
  priorityType: number;
  profileImage?: string;
  itemSiteUrl?: string;
  merchandiseId?: string;
  merchandiseName?: string;
}

export type FindBannerListRes = {
  nextPage?: string;
  banners: BannerData[];
};

const getCreatorBannerList = (pageParam: number) => {
  return axiosInstance
    .get<FindBannerListRes>(`/creator/banner/list?page=${pageParam}`)
    .then(res => res.data);
};

export const useCreatorBannerList = (params: CreatorBannerListParams, onError?: () => void) => {
  const { page } = params;
  return useInfiniteQuery('creatorBannerList', () => getCreatorBannerList(page), {
    onError,
    getNextPageParam: lastPage => lastPage.nextPage,
  });
};
