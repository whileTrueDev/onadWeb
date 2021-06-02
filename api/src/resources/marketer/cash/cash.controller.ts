import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Marketer } from '../../../decorators/sessionData.decorator';
import { MarketerDebit } from '../../../entities/MarketerDebit';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { CashService } from './cash.service';

@Controller('marketer/cash')
export class CashController {
  constructor(private readonly cashService: CashService) {}

  @UseGuards(IsAuthGuard)
  @Get()
  findCashAmount(
    @Marketer() { marketerId }: MarketerSession,
  ): Promise<Pick<MarketerDebit, 'cashAmount' | 'date'>> {
    return this.cashService.findCashAmount(marketerId);
  }

  @Post('charge')
  charge() {
    this.cashService.charge();
  }

  @Post('charge/card')
  chargeCard() {
    this.cashService.chargeCard();
  }

  @Post('refund')
  refund() {
    this.cashService.refund();
  }

  @Post('vbank')
  updateChargeVbankState() {
    this.cashService.updateChargeVbankState();
  }

  // **************************
  // * history 캐시 충전 및 사용 내역
  // **************************
  @Get('history/charge')
  async findChargeHistory(
    @Marketer() { marketerId }: MarketerSession,
  ): Promise<{ data: string[][] }> {
    const data = await this.cashService.findChargeHistory(marketerId);
    return { data };
  }

  @Get('history/refund')
  findRefundHistory() {
    this.cashService.findRefundHistory();
  }

  @Get('history/usage')
  findUsageHistory() {
    this.cashService.findUsageHistory();
  }

  @Get('history/usage/month')
  findUsageHistoryMohthly() {
    this.cashService.findUsageHistoryMohthly();
  }
}
