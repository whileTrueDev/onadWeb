import { IsString } from 'class-validator';

export class CheckIdDuplicateDto {
  @IsString()
  userid: string;
}
