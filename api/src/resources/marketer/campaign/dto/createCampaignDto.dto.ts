import { IsArray, IsDateString, IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  campaignName: string;

  @IsNumberString()
  optionType: string;

  // 특정크리에이터송출 = '0',
  // 특정트위치카테고리송출 = '1',
  // 특정아프리카카테고리송출 = '1-1',
  // 무관송출 = '2',
  @IsIn(['0', '1', '1-1', '2'])
  priorityType: '0' | '1' | '1-1' | '2';

  @IsArray()
  priorityList: string[];

  @IsArray()
  selectedTime: number[];

  @IsArray()
  keyword: string[];

  @IsNumberString()
  dailyLimit: number;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  finDate: string;

  @IsString()
  bannerId: string;

  @IsString()
  campaignDescription: string;

  @IsOptional()
  @IsString()
  connectedLinkId?: string | null;

  @IsOptional()
  @IsString()
  merchandiseId?: number | null;
}
