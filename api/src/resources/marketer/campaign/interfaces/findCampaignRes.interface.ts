import { CreatorInfo } from '../../../../entities/CreatorInfo';

export interface CampaignDetail {
  id: string;
  campaignId: string;
  campaignName: string;
  optionType: number;
  priorityType: number | string;
  regiDate: string;
  onOff: number;
  confirmState: number;
  bannerSrc: string;
  links: string;
  linkConfirmState: number;
  dailyLimit: number;
  selectedTime: string;
  targetList: string;
  startDate: string;
  finDate: string;
  bannerId: string;
  bannerRegiDate: string;
  linkId: string;
  campaignDescription: string;
  merchandiseId: string | null;
  merchandiseName: string | null;
  merchandiseStock: number | null;
  merchandiseSoldCount: number | null;
  merchandiseItemSiteUrl: string | null;
  merchandiseUploadState: number | null;
  merchandiseDenialReason: string | null;
}

export type FindCampaignRes = CampaignDetail & {
  linkData: {
    links: { primary: boolean; linkName: string; linkTo: string }[];
  };
  dailysum: number;
  selectedTime: string[];
  targetList: string[];
  targetCreators?: CreatorInfo[];
};
