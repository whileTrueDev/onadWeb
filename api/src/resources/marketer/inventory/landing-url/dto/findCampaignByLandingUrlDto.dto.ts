import { IsString } from 'class-validator';

export class FindCampaignByLandingUrlDto {
  @IsString()
  linkId: string;
}
