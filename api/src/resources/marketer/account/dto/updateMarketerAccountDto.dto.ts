import { IsString } from 'class-validator';

export class UpdateMarketerAccountDto {
  @IsString()
  bankName: string;

  @IsString()
  bankRealName: string;

  @IsString()
  bankAccount: string;
}
