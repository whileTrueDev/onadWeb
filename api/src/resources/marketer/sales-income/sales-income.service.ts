import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerSalesIncome } from '../../../entities/MarketerSalesIncome';

@Injectable()
export class SalesIncomeService {
  constructor(
    @InjectRepository(MarketerSalesIncome)
    private readonly marketerSalesIncomeRepo: Repository<MarketerSalesIncome>,
  ) {}

  findOne(marketerId: string): Promise<MarketerSalesIncome> {
    return this.marketerSalesIncomeRepo.findOne({
      where: { marketerId },
      order: { createDate: 'DESC' },
    });
  }

  findMany(marketerId: string): Promise<MarketerSalesIncome[]> {
    return this.marketerSalesIncomeRepo.find({
      where: { marketerId },
      order: { createDate: 'DESC' },
    });
  }
}
