import { IsIn, IsNumber, IsString } from 'class-validator';

export class CreateNewMarketerWithSocialLoginDto {
  @IsString()
  marketerId: string;

  @IsString()
  marketerName: string;

  @IsString()
  marketerMail: string;

  @IsString()
  marketerPhoneNum: string;

  @IsNumber()
  @IsIn([0, 1, 2])
  platformType: 0 | 1 | 2; // 'google' | 'naver' | 'kakao';
}
