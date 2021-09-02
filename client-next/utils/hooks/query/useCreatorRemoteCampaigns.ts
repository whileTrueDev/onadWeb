import { useQuery } from 'react-query';
import axios from '../../axios';

export interface RemoteCampaignParams {
  remoteControllerUrl: string;
}
export interface RemoteCampaign {
  optionType: 1 | 3; // 1 = LIVE배너광고, 3 = 판매형광고
  campaignId: string;
  index: number;
  marketerName: string;
  priorityType: number;
  targetList: string[];
  date: string;
  bannerSrc: string;
  state: number;
  campaignDescription: string;
  creatorName: string;
  merchandiseId?: string;
  merchandiseName?: string;
  merchandisePrice?: number;
  itemSiteUrl?: string;
}

const getCreatorRemoteCampaigns = async (params: RemoteCampaignParams) => {
  return axios.get<RemoteCampaign[]>('/creator/remote/campaigns', { params }).then(res => res.data);
};

export const useCreatorRemoteCampaigns = (params: RemoteCampaignParams) => {
  const result = useQuery('creatorRemoteCampaigns', () => getCreatorRemoteCampaigns(params), {
    refetchOnWindowFocus: true, // 윈도우 포커스시 재요청
    refetchOnMount: true, // 컴포넌트 마운트시 재요청
    staleTime: 1000 * 60 * 3, // 3분지나면 만료된 데이터료 표시
    enabled: !!params.remoteControllerUrl,
  });
  return result;
};
