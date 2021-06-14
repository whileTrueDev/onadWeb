import { IsString } from 'class-validator';

export class BanBannerDto {
  @IsString()
  campaignId: string;
}
