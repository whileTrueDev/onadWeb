import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { Creator } from '../../../decorators/sessionData.decorator';
import { CreatorWithdrawal } from '../../../entities/CreatorWithdrawal';
import { CreatorSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { IncomeService } from './income.service';
import { FindIncomeChartDataRes } from './interfaces/findIncomeChartDataRes.interface';
import { FindIncomeDataRes } from './interfaces/findIncomeDataRes.interface';
import { FindIncomeRaitoDataRes } from './interfaces/findIncomeRatioDataRes.interface';

@UseGuards(IsAuthGuard)
@Controller('creator/income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Get()
  findIncomeData(@Creator() { creatorId }: CreatorSession): Promise<FindIncomeDataRes> {
    return this.incomeService.findIncomeData(creatorId);
  }

  @Get('ratio')
  findIncomeRatioData(@Creator() { creatorId }: CreatorSession): Promise<FindIncomeRaitoDataRes[]> {
    return this.incomeService.findIncomeRatioData(creatorId);
  }

  @Get('withdrawal')
  findWithdrawalHistory(
    @Creator() { creatorId }: CreatorSession,
  ): Promise<Pick<CreatorWithdrawal, 'date' | 'creatorWithdrawalAmount' | 'withdrawalState'>[]> {
    return this.incomeService.findWithdrawalHistory(creatorId);
  }

  @Post('withdrawal')
  createWithdrawal(
    @Creator() { creatorId }: CreatorSession,
    @Body('withdrawalAmount', ParseIntPipe) withdrawalAmount: number,
  ): Promise<string> {
    return this.incomeService.createWithdrawal(creatorId, withdrawalAmount);
  }

  @Get('chart')
  findIncomeChartData(
    @Creator() { creatorId }: CreatorSession,
    @Query('dateRange', ParseIntPipe) dateRange: number,
  ): Promise<FindIncomeChartDataRes> {
    return this.incomeService.findIncomeChartData(creatorId, dateRange);
  }
}
