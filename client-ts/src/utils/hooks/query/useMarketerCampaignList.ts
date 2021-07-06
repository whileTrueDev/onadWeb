import { useQuery } from 'react-query';
import axios from '../../axios';

export interface CampaignTargetCreator {
  creatorId: string;
  creatorTwitchId?: string;
  creatorName?: string;
  creatorLogo?: string;
  afreecaId?: string;
  afreecaName?: string;
  afreecaLogo?: string;
}

export interface MarketerCampaign {
  id: string;
  campaignId: string;
  campaignName: string;
  optionType: number;
  priorityType: number;
  regiDate: string;
  onOff: number;
  confirmState: number;
  bannerId: string;
  bannerSrc: string;
  bannerRegiDate: string;
  linkId?: string;
  linkData?: {
    links: {
      primary: boolean;
      linkName: string;
      linkTo: string;
    }[];
  };
  linkConfirmState?: number;
  dailyLimit: number;
  dailysum: number;
  campaignDescription: string;
  startDate: string;
  finDate: string;
  selectedTime: number[];
  targetList: string[];
  targetCreators?: CampaignTargetCreator[];
  merchandiseId?: number;
  merchandiseName?: string;
  merchandiseStock?: number;
  merchandiseSoldCount?: number;
  merchandiseItemSiteUrl?: string;
  merchandiseUploadState?: number;
  merchandiseDenialReason?: string;
}

export interface MarketerCampaignListParams {
  offset: number;
  page: number;
}

const getMarketerCampaignList = async (params: MarketerCampaignListParams) => {
  return axios.get<MarketerCampaign[]>('/marketer/campaign/list', { params }).then(res => res.data);
};

export const useMarketerCampaignList = (params: MarketerCampaignListParams) => {
  const { offset, page } = params;
  return useQuery(['marketerCampaignList', offset, page], () => getMarketerCampaignList(params), {
    keepPreviousData: true,
    // staleTime 1일
    cacheTime: 1000 * 60 * 60, // 캐시 1시간 유지
  });
};
