import { IsOptional, IsString } from 'class-validator';

export class FindSettlementLogsDto {
  @IsOptional()
  @IsString()
  settlementLogId?: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsString()
  month?: string;

  @IsOptional()
  @IsString()
  roundInMonth?: string;
}
