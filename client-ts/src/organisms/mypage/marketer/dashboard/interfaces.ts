export interface campaignInterface {
  campaignId: string;
  campaignName: string;
  optionType: number;
  priorityType: number;
  regiDate: Date;
  onOff: number;
  bannerSrc: string;
  dailyLimit: number;
  dailysum: number;
}

export interface onOffInterface {
  onOffState: boolean;
}

export interface adInterface {
  cashAmount: number;
  spendAll: number;
}

export interface countInterface {
  counts: number;
}

export interface valueChartInterface {
  date: string;
  cash: number;
  type: 'CPM' | 'CPC';
}

export interface actionLogInterface {
  id: number;
  marketerId: string;
  type: number;
  detail: string;
  date: Date
}

export interface reportInterface {
  campaignName: string;
  totalCPM: number;
  totalViewCount: number;
  totalTime: number;
  totalCPC: number;
  totalClick: number;
  totalTransfer: number;
  totalLandingView: number;
}

export interface creatorDataInterface {
  creatorId: string;
  creatorName: string;
  creatorTwitchId: string;
  creatorLogo: string;
  total_ad_exposure_amount: number;
  viewer: number;
  followers: number;
  airtime: number;
  impression: number;
  openHour: number;
  content: number;
}

export interface heatmapInterface {
  date: string;
  count: number;
}

export interface geoInterface {
  id: number;
  type: number;
  ipAddress: string;
  campaignId: string;
  creatorId: string;
  date: Date;
}

export interface creatorDetailInterface {
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

