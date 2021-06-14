import { IsBoolean, IsString } from 'class-validator';
import { MarketerSettlement } from '../../../../entities/MarketerSettlement';

type CreateSettlementInterface = Omit<
  MarketerSettlement,
  'id' | 'marketerId' | 'createDate' | 'updateDate' | 'state'
> & { bankName: string };

export class CreateMarketerSettlementDto implements CreateSettlementInterface {
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
}
