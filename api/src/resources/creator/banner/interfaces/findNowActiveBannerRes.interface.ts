export interface FindNowActiveBannerResObj {
  bannerId: string;
  bannerSrc: string;
  campaignName: string;
  campaignDescription: string;
  links: string;
  regiDate: string;
  profileImage: string;
  marketerName: string;
  date: string;
  merchandiseName: string | null;
  itemSiteUrl: string | null;
}

export type FindNowActiveBannerRes = FindNowActiveBannerResObj[];
