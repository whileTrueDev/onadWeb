import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRemoteOnOffDto {
  @IsString()
  campaignId: string;

  @IsNotEmpty()
  state: string | number;

  @IsString()
  url: string;
}
