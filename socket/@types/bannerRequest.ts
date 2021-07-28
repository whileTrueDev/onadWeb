export interface CampaignIdOptionType {
  [_: string]: [number, string, string];
}

export interface Campaign {
  startDate: Date;
  finDate: Date;
  campaignId: string;
  campaignName: string;
  selectedTime: Date;
  optionType: number;
  campaignDescription: string;
}

export interface ReturnDate {
  [key: string]: Date;
}

export interface LinkJson {
  linkName: string;
  linkTo: string;
  primary: boolean;
}

export interface CreatorIds {
  creatorId: string;
  creatorTwitchId?: string;
  afreecaId?: string;
  adChatAgreement: number;
}

export interface BanPausedCampaign {
  [key: string]: string[];
}
