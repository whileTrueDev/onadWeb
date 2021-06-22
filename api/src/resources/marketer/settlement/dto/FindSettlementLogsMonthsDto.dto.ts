import { IsString } from 'class-validator';

export class FindSettlementLogsMonthsDto {
  @IsString()
  year: string;
}
