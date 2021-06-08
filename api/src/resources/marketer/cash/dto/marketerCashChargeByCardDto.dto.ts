import { IsString } from 'class-validator';

export class MarketerCashChargeByCardDto {
  @IsString()
  chargeCashString: string;

  @IsString()
  chargeType: string;

  @IsString()
  imp_uid: string;

  @IsString()
  merchant_uid: string;
}
