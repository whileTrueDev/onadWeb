export interface CampaignInterface {
  campaignId: string;
  campaignName: string;
  optionType: number;
  priorityType: number;
  regiDate: string;
  onOff: number;
  confirmState: number;
  bannerSrc: string;
  linkData: {
    links: {
      primary: boolean;
      linkName: string;
      linkTo: string;
    }[];
  };
  linkConfirmState: number;
  dailyLimit: number;
  dailysum: number;
  campaignDescription: string;
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

export interface CreatorDataInterface {
  creatorId: string;
  creatorName: string;
  // twitch information
  creatorTwitchId: string;
  creatorTwitchName: string;
  creatorLogo: string;
  // afreeca information
  afreecaId: string;
  afreecaName: string;
  afreecaLogo: string;

  total_ad_exposure_amount: number;
  viewer: number;
  followers: number;
  airtime: number;
  impression: number;
  openHour: number;
  content: number;
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
