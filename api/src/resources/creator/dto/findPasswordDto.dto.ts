import { IsString } from 'class-validator';

export class FindPasswordDto {
  @IsString()
  password: string;
}
