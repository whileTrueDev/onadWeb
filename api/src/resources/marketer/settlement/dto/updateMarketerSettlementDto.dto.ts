import { IsBoolean, IsInt, IsString } from 'class-validator';
import { MarketerSettlement } from '../../../../entities/MarketerSettlement';

type UpdateSettlementInterface = Omit<
  MarketerSettlement,
  'marketerId' | 'createDate' | 'updateDate' | 'state'
> & { bankName: string };

export class UpdateMarketerSettlementDto implements UpdateSettlementInterface {
  @IsString()
  bankAccountImgSrc: string;

  @IsString()
  bankAccountNumber: string;

  @IsString()
  bankAccountOwner: string;

  @IsString()
  bankName: string;

  @IsBoolean()
  businessmanFlag: boolean;

  @IsString()
  identificationImgSrc: string;

  @IsString()
  identificationNumber: string;

  @IsString()
  name: string;

  @IsInt()
  id: number;
}
