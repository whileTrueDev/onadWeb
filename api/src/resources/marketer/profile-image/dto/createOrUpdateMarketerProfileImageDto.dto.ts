import { IsBase64, IsString } from 'class-validator';

export class CreateOrUpdateMarketerProfileImageDto {
  @IsString()
  @IsBase64()
  profileImage: string;
}
