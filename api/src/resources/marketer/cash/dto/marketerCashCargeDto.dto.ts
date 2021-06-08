import { IsString } from 'class-validator';

export class MarketerCashCargeDto {
  @IsString()
  chargeCashString: string;

  @IsString()
  chargeType: string;
}
