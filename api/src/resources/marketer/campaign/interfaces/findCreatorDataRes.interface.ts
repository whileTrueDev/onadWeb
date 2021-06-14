export interface FindCreatorDataResObj {
  id: string;
  creatorId: string;
  creatorTwitchName: string;
  creatorTwitchId: string;
  creatorLogo: string;
  afreecaId: string;
  afreecaName: string;
  afreecaLogo: string;
  recentDate: string;
}

interface CommonCampaignAmouat {
  total_ad_exposure_amount: string;
}

export type FindCreatorDataRes = Array<FindCreatorDataResObj & CommonCampaignAmouat>;

interface CreatorDataByCampaign {
  viewer: number;
  followers: number;
  airtime: number;
  impression: number;
  openHour: string;
  conten: string;
  ctr: string;
  contentsGraphData: string;
  timeGraphData: string;
  contentsGraphDataAfreeca: string | null;
  timeGraphDataAfreeca: string | null;
  viewerAfreeca: number | null;
  ctrAfreeca: string | null;
  followersAfreeca: number | null;
  airtimeAfreeca: number | null;
  impressionAfreeca: number | null;
  openHourAfreeca: string | null;
  contentAfreeca: string | null;
}

export type FindCreatorDataByCampaignResObj = FindCreatorDataResObj &
  CommonCampaignAmouat &
  CreatorDataByCampaign;

export type FindCreatorDataByCampaignRes = FindCreatorDataByCampaignResObj[];
