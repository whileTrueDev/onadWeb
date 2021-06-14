import { OnadCampaignType } from '../../../../interfaces/OnadCampaignType.interface';

export interface FindExpenditureResObj {
  date: string;
  value: number;
  type: OnadCampaignType;
}

export type FindExpenditureRes = FindExpenditureResObj[];
