import { IsString } from 'class-validator';

export class FindReferralCodeDto {
  @IsString()
  referralCode: string;
}
