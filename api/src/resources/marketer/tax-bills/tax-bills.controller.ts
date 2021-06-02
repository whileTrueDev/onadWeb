import { Controller, Get, UseGuards } from '@nestjs/common';
import { Marketer } from '../../../decorators/sessionData.decorator';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { FindTaxBillsRes } from './interfaces/findTaxBillsRes.interface';
import { TaxBillsService } from './tax-bills.service';

@Controller('marketer/tax-bills')
export class TaxBillsController {
  constructor(private readonly taxBillsService: TaxBillsService) {}

  @UseGuards(IsAuthGuard)
  @Get()
  findTaxBills(@Marketer() { marketerId }: MarketerSession): Promise<FindTaxBillsRes> {
    return this.taxBillsService.findTaxBills(marketerId);
  }
}
