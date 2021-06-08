import { IsString } from 'class-validator';

export class FindCampaignGeoDataDto {
  @IsString()
  campaignId: string;
}
