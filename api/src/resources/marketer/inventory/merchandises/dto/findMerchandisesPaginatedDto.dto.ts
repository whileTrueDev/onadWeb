import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../../../dto/paginationDto.dto';

export class FindMerchandisesPaginatedDto implements Partial<PaginationDto> {
  @IsOptional()
  @IsBoolean()
  onlyNotConnected?: boolean;

  @IsOptional()
  page: string;

  @IsOptional()
  offset: string;
}
