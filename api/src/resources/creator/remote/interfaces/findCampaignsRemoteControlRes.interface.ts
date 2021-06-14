export interface FindCampaignsRemoteControlResult {
  optionType: number;
  campaignId: string;
  marketerName: string;
  priorityType: number;
  targetList: string;
  date: string;
  state: number;
  campaignDescription: string;
  merchandiseId: string | null;
  merchandiseName: string | null;
  merchandisePrice: string | null;
  itemSiteUrl: string | null;
  bannerSrc: string;
}

export type FindCampaignsRemoteControlResObj = Omit<
  FindCampaignsRemoteControlResult,
  'targetList'
> & {
  targetList: string[];
  creatorName: string;
};

export type FindCampaignsRemoteControlRes = FindCampaignsRemoteControlResObj[];
