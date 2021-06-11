import { IsNumberString, IsString } from 'class-validator';

export class MarketerCashChargeByCardDto {
  @IsNumberString()
  chargeCash: string;

  @IsString()
  chargeType: string;

  @IsString()
  imp_uid: string;

  @IsString()
  merchant_uid: string;
}
