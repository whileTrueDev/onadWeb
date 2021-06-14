import { IsString } from 'class-validator';

export class CreateNewMarketerDto {
  @IsString()
  marketerId: string;

  @IsString()
  marketerName: string;

  @IsString()
  marketerMail: string;

  @IsString()
  marketerPhoneNum: string;

  @IsString()
  marketerRawPasswd: string;
}
