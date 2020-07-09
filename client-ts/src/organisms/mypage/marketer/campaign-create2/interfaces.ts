export interface CreatorDetailDataInterface {
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

export interface LandingUrlData {
  linkId: string;
  marketerId: string;
  confirmState: number;
  denialReason: string;
  links: { links: { linkName: string; linkTo: string; primary: boolean }[] };
  regiDate: string;
  updateDate: string;
}

export interface AdMaterial {
   name: string; desc: string;
   images: {src: string; desc: string}[]; lastDesc: string ;
   billingType: string;
}
export interface OptionInterface {
  id: string; primaryText: string; secondaryText: string;
  materials?: AdMaterial[];
}
