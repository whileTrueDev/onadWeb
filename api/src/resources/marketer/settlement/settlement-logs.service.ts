import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { MarketerSalesIncomeSettlementLogs } from '../../../entities/MarketerSalesIncomeSettlementLogs';
import { MerchandiseOrdersDetailRepository } from '../../../repositories/MerchandiseOrdersDetail.repository';
import { FindSettlementLogsRes } from './interfaces/FindSettlementLogsRes.interface';

@Injectable()
export class SettlementLogsService {
  constructor(
    @InjectRepository(MarketerSalesIncomeSettlementLogs)
    private readonly marketerSalesIncomeSettlementLogsRepo: Repository<
      MarketerSalesIncomeSettlementLogs
    >,
    @InjectRepository(MerchandiseOrdersDetailRepository)
    private readonly merchandiseOrdersDetailRepo: MerchandiseOrdersDetailRepository,
  ) {}

  async findAllMonthly(
    marketerId: string,
    year: string | number,
  ): Promise<Array<Omit<MarketerSalesIncomeSettlementLogs, 'doneDate'> & { doneDate: string }>> {
    const data = await this.marketerSalesIncomeSettlementLogsRepo
      .createQueryBuilder()
      .where('marketerId = :marketerId', { marketerId: 'thesencare' })
      .andWhere('YEAR(doneDate) = :year', { year })
      .orderBy('doneDate', 'DESC')
      .getMany();

    return data.map(d => ({ ...d, doneDate: dayjs(d.doneDate).format('YYYY-MM') }));
  }

  public async findAllByOrder(
    marketerId: string,
    year: string | number,
    month: string | number,
  ): Promise<FindSettlementLogsRes> {
    const data = await this.marketerSalesIncomeSettlementLogsRepo
      .createQueryBuilder()
      .where('marketerId = :marketerId', { marketerId: 'thesencare' })
      .andWhere('YEAR(doneDate) = :year', { year })
      .andWhere('MONTH(doneDate) = :month', { month })
      .orderBy('doneDate', 'DESC')
      .getOne();

    return this.merchandiseOrdersDetailRepo._findSettlementBySettlementLogId(data.id);
  }

  public async findAllById(
    marketerId: string,
    settlementLogId: number,
  ): Promise<FindSettlementLogsRes> {
    return this.merchandiseOrdersDetailRepo._findSettlementBySettlementLogId(settlementLogId);
  }

  public async findMonths(marketerId: string): Promise<string[]> {
    const data = await this.marketerSalesIncomeSettlementLogsRepo
      .createQueryBuilder()
      .select('MONTH(doneDate) AS month')
      .groupBy('MONTH(doneDate)')
      .orderBy('doneDate', 'DESC')
      .where('marketerId = :marketerId', { marketerId: 'thesencare' })
      .getRawMany();

    return data.map(d => String(d.month));
  }

  public async findYears(marketerId: string): Promise<string[]> {
    const data = await this.marketerSalesIncomeSettlementLogsRepo
      .createQueryBuilder()
      .select('YEAR(doneDate) AS year')
      .groupBy('YEAR(doneDate)')
      .orderBy('doneDate', 'DESC')
      .where('marketerId = :marketerId', { marketerId: 'thesencare' })
      .getRawMany();
    return data.map(d => String(d.year));
  }
}
