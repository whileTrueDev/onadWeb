import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

class UpdateCampaignData {
  @IsOptional()
  @IsString()
  campaignName: string;

  @IsOptional()
  @IsBoolean()
  noBudget: string;

  @IsOptional()
  @IsString()
  budget: string;
}
export class UpdateCampaignDto {
  @IsString()
  campaignId: string;

  @IsNotEmpty()
  @ValidateNested()
  data: UpdateCampaignData;

  @IsIn(['name', 'budget'])
  type: 'name' | 'budget';
}
