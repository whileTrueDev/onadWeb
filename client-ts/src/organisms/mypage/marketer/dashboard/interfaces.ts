export interface CampaignTargetCreator {
  creatorId: string;
  creatorTwitchId?: string;
  creatorName?: string;
  creatorLogo?: string;
  afreecaId?: string;
  afreecaName?: string;
  afreecaLogo?: string;
}
export interface CampaignInterface {
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

export interface OnOffInterface {
  onOffState: boolean;
}

export interface AdInterface {
  cashAmount: number;
  spendAll: number;
}

export interface CountInterface {
  counts: number;
}

export interface ValueChartInterface {
  date: string;
  cash: number;
  type: 'CPM' | 'CPC';
}

export interface ActionLogInterface {
  id: number;
  marketerId: string;
  type: number;
  detail: string;
  date: Date;
}

export interface ReportInterface {
  campaignName: string;
  totalCPM: number;
  totalViewCount: number;
  totalTime: number;
  totalCPC: number;
  totalClick: number;
  totalTransfer: number;
  totalLandingView: number;
}

export interface ReportInterfaceV2 {
  campaignName: string; totalCPM: number; totalViewCount: number;
  totalCPC: number; adchatClick: number; adpanelClick: number;
}
export interface CreatorDataPerMarketerInterface {
  id: string;
  creatorId: string;
  // twitch information
  creatorTwitchName?: string;
  creatorTwitchId?: string;
  creatorLogo?: string;
  // afreeca information
  afreecaId?: string;
  afreecaName?: string;
  afreecaLogo?: string;

  total_ad_exposure_amount: number;
  recentDate: string;
}
export interface CreatorDataInterface {
  id: string;
  creatorId: string;
  // twitch information
  creatorTwitchName?: string;
  creatorTwitchId?: string;
  creatorLogo?: string;
  // afreeca information
  afreecaId?: string;
  afreecaName?: string;
  afreecaLogo?: string;

  total_ad_exposure_amount: number;
  recentDate: string;
  viewer?: number;
  followers?: number;
  airtime?: number;
  impression?: number;
  openHour?: number;
  content?: number;
  ctr?: number;
  contentsGraphData?: string;
  contentsGraphDataAfreeca?: string;
  timeGraphData?: string;
  timeGraphDataAfreeca?: string;
  viewerAfreeca?: number;
  followersAfreeca?: number;
  airtimeAfreeca?: number;
  impressionAfreeca?: number;
  openHourAfreeca?: number;
  contentAfreeca?: number;
}

export interface HeatmapInterface {
  date: string;
  count: number;
}


export type GeoInterface = {
  latitude: number;
  longitude: number;
  range: number[];
  country: string;
  region: string;
  city: string;
  ll: number[];
};

export interface CreatorDetailInterface {
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
  creatorLogo: string;
  creatorName: string;
}
