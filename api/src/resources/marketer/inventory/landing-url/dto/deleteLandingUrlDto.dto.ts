import { IsString } from 'class-validator';

export class DeleteLandingUrlDto {
  @IsString()
  linkId: string;
}
