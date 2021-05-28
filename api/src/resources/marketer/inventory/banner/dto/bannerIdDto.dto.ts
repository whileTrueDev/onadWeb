import { IsString } from 'class-validator';

export class BannerIdDto {
  @IsString()
  bannerId: string;
}
