import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerTaxBill } from '../../../entities/MarketerTaxBill';
import { FindTaxBillsRes, TaxBillState } from './interfaces/findTaxBillsRes.interface';

@Injectable()
export class TaxBillsService {
  constructor(
    @InjectRepository(MarketerTaxBill)
    private readonly marketerInfoRepo: Repository<MarketerTaxBill>,
  ) {}

  private getTaxBillStateString(stateNumber: number) {
    switch (stateNumber) {
      case 0:
        return TaxBillState.발행대기;
      case 1:
        return TaxBillState.발행완료;
      case 2:
        return TaxBillState.미발행;
      default:
        return TaxBillState.미발행;
    }
  }

  async findTaxBills(marketerId: string): Promise<FindTaxBillsRes> {
    const result = await this.marketerInfoRepo.find({
      where: { marketerId },
      order: { date: 'DESC' },
    });

    return result.map(tax => ({
      ...tax,
      state: this.getTaxBillStateString(tax.state),
      cashAmount: tax.cashAmount ? tax.cashAmount.toString() : '0',
    }));
  }
}
