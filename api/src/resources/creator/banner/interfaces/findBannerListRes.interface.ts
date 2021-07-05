import { OnadCampaignType } from '../../../../interfaces/OnadCampaignType.interface';

export interface FindBannerListResult {
  campaignId: string;
  date: string;
  creatorId: string;
  bannerSrc: string;
  connectedLinkId: string;
  state: number;
  marketerName: string;
  campaignDescription: string;
  priorityType: number;
  optionType: number;
  targetList: string;
  marketerContraction: number;
  profileImage: string | null;
  links: string;
  itemSiteUrl: string | null;
  merchandiseId: string | null;
  merchandiseName: string | null;
}

export interface FindBannerIncomeListResult {
  type: OnadCampaignType;
  cash: number;
  campaignId: string;
}

export type FindBannerListResObj = FindBannerListResult & {
  cash: number;
  CPM: number;
  CPC: number;
};
export type FindBannerListRes = {
  nextPage?: number;
  banners: FindBannerListResObj[];
};
