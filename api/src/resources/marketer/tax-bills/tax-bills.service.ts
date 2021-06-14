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
        return TaxBillState[0];
      case 1:
        return TaxBillState[1];
      case 2:
        return TaxBillState[2];
      default:
        return TaxBillState[2];
    }
  }

  async findTaxBills(marketerId: string): Promise<FindTaxBillsRes> {
    const result = await this.marketerInfoRepo.find({
      where: { marketerId },
      order: { date: 'DESC' },
      select: ['date', 'cashAmount', 'state'],
    });

    const sendArray: string[][] = [];
    result.forEach(taxBill => {
      const object: any = { date: taxBill.date };
      object.cashAmount = object.cashAmount ? object.cashAmount.toString() : '0';
      object.state = this.getTaxBillStateString(taxBill.state);
      sendArray.push(Object.values(object));
    });
    return sendArray;
  }
}
