import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCampaignDto {
  @IsString()
  campaignId: string;

  @IsNotEmpty()
  data: string | number;

  @IsIn(['name', 'budget'])
  type: 'name' | 'budget';
}
