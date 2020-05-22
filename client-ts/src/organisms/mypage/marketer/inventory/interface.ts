export interface BannerDataInterface {
  bannerSrc: string;
  confirmState: number;
  bannerId: string;
  bannerDenialReason: string;
  date: string;
  regiDate: string;
}

export interface UrlDataInterface {
  linkId: string;
  marketerId: string;
  confirmState: number;
  denialReason: string;
  links: {
    links: {
      primary: boolean;
      linkName: string;
      linkTo: string;
    }[];
  };
  linkDescription: string;
  regiDate: string;
  updateDate: Date;
}
