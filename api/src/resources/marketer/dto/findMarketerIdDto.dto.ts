import { IsString } from 'class-validator';

export class FindMarketerIdDto {
  @IsString()
  marketerName: string;

  @IsString()
  marketerMail: string;
}
