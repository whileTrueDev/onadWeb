import { IsNumberString } from 'class-validator';

export class PaginationDto {
  @IsNumberString()
  page: string | number;

  @IsNumberString()
  offset: string | number;
}
