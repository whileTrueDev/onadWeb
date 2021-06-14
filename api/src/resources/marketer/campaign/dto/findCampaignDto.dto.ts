import { IsString } from 'class-validator';

export class FindCampaignDto {
  @IsString()
  campaignId: string;
}
