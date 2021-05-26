import { IsOptional, IsString } from 'class-validator';

export class FindOrdersDto {
  @IsOptional()
  @IsString()
  merchandiseId?: string;

  @IsOptional()
  @IsString()
  campaignId?: string;
}
