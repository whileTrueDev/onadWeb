export interface BannerDataInterface {
  id: string;
  bannerId: string;
  bannerSrc: string;
  confirmState: number;
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
  regiDate: string;
  updateDate: Date;
}
