import { IsInt } from 'class-validator';

export class DeleteMerchandiseDto {
  @IsInt()
  id: number;
}
