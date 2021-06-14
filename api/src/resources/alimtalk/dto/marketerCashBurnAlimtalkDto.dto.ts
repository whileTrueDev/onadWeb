import { IsString } from 'class-validator';

export class MarketerCashBurnAlimtalkDto {
  @IsString()
  marketerId: string;
}
