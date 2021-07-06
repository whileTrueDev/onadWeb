import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerBannerParams {
  offset: number;
  page: number;
}

export interface MarketerBanner {
  id: string;
  bannerId: string;
  bannerSrc: string;
  confirmState: number;
  bannerDenialReason: string;
  date: string;
  regiDate: string;
}

const getMarketerBannerList = async (params: MarketerBannerParams) => {
  return axios.get<MarketerBanner[]>('/marketer/banner/list', { params }).then(res => res.data);
};

export const useMarketerBannerList = (params: MarketerBannerParams) => {
  const { page, offset } = params;
  return useQuery(
    ['marketerBannerList', offset, page],
    () => getMarketerBannerList({ page, offset }),
    {
      keepPreviousData: true,
      // staleTime 10분
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 10, // 캐시 10 분 유지
    },
  );
};
