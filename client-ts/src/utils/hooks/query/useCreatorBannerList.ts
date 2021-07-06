import { useInfiniteQuery } from 'react-query';
import axiosInstance from '../../axios';

export interface CreatorBannerListParams {
  pageParam: number;
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

export const useCreatorBannerList = (onError?: () => void) => {
  return useInfiniteQuery(
    'creatorBannerList',
    async ({ pageParam = 0 }) => {
      return axiosInstance
        .get<FindBannerListRes>(`/creator/banner/list?page=${pageParam}`)
        .then(res => res.data);
    },
    {
      onError,
      getNextPageParam: lastPage => lastPage.nextPage ?? false,
      staleTime: 1000 * 60 * 30, // 30분 후 데이터 만료로 표시
      cacheTime: 1000 * 60 * 60, // 캐시 1시간 유지
    },
  );
};
