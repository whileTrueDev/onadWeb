import { useQuery } from 'react-query';
import axios from '../../axios';

export interface CreatorDetailDataInterface {
  // 트위치 지표
  creatorId: string;
  followers: number;
  viewer: number;
  peakview: number;
  airtime: number;
  impression: number;
  ctr: number;
  cost: number;
  rip: number;
  content: string;
  openHour: string;
  timeGraphData: string;
  contentsGraphData: string;
  date: Date;
  viewerHeatmatData: string | null;
  // 아프리카 지표
  creatorIdAfreeca: string;
  followersAfreeca: number;
  viewerAfreeca: number;
  peakviewAfreeca: number;
  airtimeAfreeca: number;
  impressionAfreeca: number;
  ctrAfreeca: number;
  costAfreeca: number;
  ripAfreeca: number;
  contentAfreeca: string;
  openHourAfreeca: string;
  timeGraphDataAfreeca: string;
  contentsGraphDataAfreeca: string;
  dateAfreeca: Date;
  viewerHeatmatDataAfreeca: string | null;

  creatorTwitchId?: string;
  creatorLogo?: string;
  afreecaLogo?: string;
  creatorName?: string;
  afreecaName?: string;
  afreecaId?: string;
}

const getCreatorsAnalysisDetail = async () => {
  return axios.get<CreatorDetailDataInterface[]>('/creators/analysis/detail').then(res => res.data);
};

export const useCreatorsAnalysisDetail = () => {
  return useQuery('creatorsAnalysisDetail', getCreatorsAnalysisDetail, {
    // staleTime 10분
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10, // 캐시 10 분 유지
  });
};
