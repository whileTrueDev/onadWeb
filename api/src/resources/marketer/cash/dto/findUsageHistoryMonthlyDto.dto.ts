import { IsString } from 'class-validator';

export class FindUsageHistoryMonthlyDto {
  @IsString()
  month: string;
}
