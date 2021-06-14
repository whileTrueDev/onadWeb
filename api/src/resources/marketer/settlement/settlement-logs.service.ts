import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerSalesIncomeSettlementLogs } from '../../../entities/MarketerSalesIncomeSettlementLogs';

@Injectable()
export class SettlementLogsService {
  constructor(
    @InjectRepository(MarketerSalesIncomeSettlementLogs)
    private readonly marketerSalesIncomeSettlementLogsRepo: Repository<
      MarketerSalesIncomeSettlementLogs
    >,
  ) {}

  async findAll(marketerId: string): Promise<Array<string[]>> {
    const result = (await this.marketerSalesIncomeSettlementLogsRepo
      .createQueryBuilder()
      .select(
        'DATE_FORMAT(doneDate, "%y년 %m월 %d일") as doneDate, FORMAT(amount + amountDeliveryFee, 0) as amount',
      )
      .where('marketerId = :marketerId', { marketerId })
      .orderBy('doneDate', 'DESC')
      .getRawMany()) as MarketerSalesIncomeSettlementLogs[];

    return result.map(log => Object.values(log));
  }
}
