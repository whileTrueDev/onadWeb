import { useQuery } from 'react-query';
import axiosInstance from '../../axios';

export interface CreatorClicksCurrentParams {
  offset: number;
  page: number;
}
export interface CurrentClickRes {
  id: string;
  clickedTime: string;
  costType: string;
  linkId: string;
  campaignName: string;
  creatorId: string;
  payout: number;
  channel: string;
  os: string;
  browser: string;
  links?: {
    links: Array<{ primary: boolean; linkTo: string; linkName: string }>;
  };
  merchandiseId?: number;
  itemSiteUrl?: string;
}

const getCreatorClicksCurrent = (params: CreatorClicksCurrentParams) => {
  return axiosInstance
    .get<CurrentClickRes[]>('/creator/clicks/current', {
      params: {
        ...params,
      },
    })
    .then(res => res.data);
};

export const useCreatorClicksCurrent = (params: CreatorClicksCurrentParams) => {
  const { offset, page } = params;
  return useQuery(
    ['creatorClicksCurrent', offset, page],
    () => getCreatorClicksCurrent({ offset, page }),
    { keepPreviousData: true },
  );
};
