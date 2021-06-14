import { Controller, Get, UseGuards } from '@nestjs/common';
import { Marketer } from '../../../decorators/sessionData.decorator';
import { MarketerSalesIncome } from '../../../entities/MarketerSalesIncome';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { SalesIncomeService } from './sales-income.service';

@Controller('marketer/sales-income')
export class SalesIncomeController {
  constructor(private readonly salesIncomeService: SalesIncomeService) {}

  @UseGuards(IsAuthGuard)
  @Get()
  findOne(@Marketer() { marketerId }: MarketerSession): Promise<MarketerSalesIncome> {
    return this.salesIncomeService.findOne(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Get()
  findMany(@Marketer() { marketerId }: MarketerSession): Promise<MarketerSalesIncome[]> {
    return this.salesIncomeService.findMany(marketerId);
  }
}
