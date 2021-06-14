import { IsString } from 'class-validator';

export class FindCampaignsRemoteControlDto {
  @IsString()
  remoteControllerUrl: string;
}
