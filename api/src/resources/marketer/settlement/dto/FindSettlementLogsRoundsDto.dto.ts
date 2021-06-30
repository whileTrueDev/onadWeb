import { IsString } from 'class-validator';

export class FindSettlementLogsRoundsDto {
  @IsString()
  month: string;

  @IsString()
  year: string;
}
