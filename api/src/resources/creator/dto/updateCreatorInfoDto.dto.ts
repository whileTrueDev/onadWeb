import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateCreatorInfoDto {
  @IsOptional()
  @IsString()
  newIp?: string;

  @IsOptional()
  @IsIn(['CPAAgreement', 'contraction'])
  type?: 'CPAAgreement' | 'contraction';
}
