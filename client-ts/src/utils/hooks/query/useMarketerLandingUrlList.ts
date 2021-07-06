import { useQuery } from 'react-query';
import axios from '../../axios';

export interface MarketerLandingUrlParams {
  offset: number;
  page: number;
}

export interface LandingUrlLink {
  primary: boolean;
  linkName: string;
  linkTo: string;
}
export interface LandingUrlLinks {
  links: LandingUrlLink[];
}

export interface MarketerLandingUrl {
  id: string;
  linkId: string;
  marketerId: string;
  confirmState: number;
  denialReason: string;
  links: LandingUrlLinks;
  regiDate: string;
  updateDate: Date;
}

const getMarketerLandingUrlList = async (params: MarketerLandingUrlParams) => {
  return axios
    .get<MarketerLandingUrl[]>('/marketer/landing-url/list', { params })
    .then(res => res.data);
};

export const useMarketerLandingUrlList = (params: MarketerLandingUrlParams) => {
  const { page, offset } = params;
  return useQuery(
    ['marketerLandingUrlList', offset, page],
    () => getMarketerLandingUrlList({ page, offset }),
    {
      keepPreviousData: true,
      // staleTime 10분
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 10, // 캐시 10 분 유지
    },
  );
};
