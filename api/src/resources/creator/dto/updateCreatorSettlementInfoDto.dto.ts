import { IsInt, IsString } from 'class-validator';

export class UpdateCreatorSettlementInfoDto {
  @IsString()
  bankName: string;

  @IsString()
  bankRealName: string;

  @IsString()
  bankAccount: string;

  @IsString()
  CreatorName: string;

  @IsInt()
  CreatorType: number;

  @IsString()
  CreatorIdentity: string;

  @IsString()
  CreatorPhone: string;

  @IsString()
  CreatorIDImg: string;

  @IsString()
  CreatorAccountImg: string;

  @IsString()
  CreatorBussinessImg: string;
}
