export interface bannerDataInterface {
  bannerSrc: string;
  confirmState: number;
  bannerId: string;
  bannerDenialReason: string;
  bannerDescription: string;
  date: string;
  regiDate: string;
}

export interface urlDataInterface {
  linkId: string;
  marketerId: string;
  confirmState: number;
  denialReason: string;
  links: {
    links: {
      primary: boolean;
      linkName: string;
      linkTo: string;
    }[]
  }
  regiDate: string;
  updateDate: Date;
}