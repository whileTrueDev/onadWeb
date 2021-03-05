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
export interface Merchandise {
  id: number;
  name: string;
  price: number;
  stock: number;
  optionFlag?: boolean;
  description: string;
  images: string;
  pickupFlag?: boolean;
  pickupId: string;
  createDate?: Date;
  updateDate?: Date;
  mallUploadFlag?: boolean;
}
