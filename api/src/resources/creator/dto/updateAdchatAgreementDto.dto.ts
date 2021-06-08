import { IsNotEmpty } from 'class-validator';

export class UpdateAdchatAgreementDto {
  @IsNotEmpty()
  targetOnOffState: string | number;
}
