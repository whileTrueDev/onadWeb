import { IsOptional, IsString } from 'class-validator';

export class CreateCreatorDto {
  @IsString()
  userid: string;

  @IsString()
  passwd: string;

  @IsOptional()
  @IsString()
  referralCode?: string;
}
