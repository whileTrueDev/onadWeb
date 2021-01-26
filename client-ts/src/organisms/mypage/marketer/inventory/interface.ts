export interface BannerDataInterface {
  id: string;
  bannerId: string;
  bannerSrc: string;
  confirmState: number;
  bannerDenialReason: string;
  date: string;
  regiDate: string;
}

export interface UrlLink {
  primary: boolean;
  linkName: string;
  linkTo: string;
}
export interface UrlLinks {
  links: UrlLink[];
}
export interface UrlDataInterface {
  id: string;
  linkId: string;
  marketerId: string;
  confirmState: number;
  denialReason: string;
  links: UrlLinks;
  regiDate: string;
  updateDate: Date;
}
