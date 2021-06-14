import { IsString } from 'class-validator';

export class DeleteCampaignDto {
  @IsString()
  campaignId: string;
}
