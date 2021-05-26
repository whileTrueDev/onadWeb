import { IsString } from 'class-validator';

export class UpdateMarketerBusinessInfoDto {
  @IsString()
  value: string;
}
