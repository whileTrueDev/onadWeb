import { IsNumberString, IsString } from 'class-validator';

export class MarketerCashCargeDto {
  @IsNumberString()
  chargeCash: string;

  @IsString()
  chargeType: string;
}
