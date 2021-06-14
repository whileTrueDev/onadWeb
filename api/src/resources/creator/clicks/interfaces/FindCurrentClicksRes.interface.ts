export interface FindCurrentClicksResult {
  id: string;
  clickedTime: string;
  costType: string;
  linkId: string;
  campaignName: string;
  links: string;
  creatorId: string;
  payout: number;
  channel: string;
}

export type FindCurrentClicksResObj = Omit<FindCurrentClicksResult, 'links'> & {
  links: { primary: boolean; linkTo: string; linkName: string }[];
};

export type FindCurrentClicksRes = FindCurrentClicksResObj[];
