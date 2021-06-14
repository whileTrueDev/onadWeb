import { IsString } from 'class-validator';

export class CreateCreatorPreUserDto {
  @IsString()
  creatorId: string;

  @IsString()
  userid: string;

  @IsString()
  passwd: string;

  @IsString()
  accessToken: string;
}
