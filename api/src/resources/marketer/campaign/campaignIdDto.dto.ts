import { IsString } from 'class-validator';

export class CampaignIdDto {
  @IsString()
  campaignId: string;
}
