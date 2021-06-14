import { IsBoolean, IsString } from 'class-validator';

export class ChangeCampaignOnOffStateDto {
  @IsBoolean()
  onoffState: boolean;

  @IsString()
  campaignId: string;
}
