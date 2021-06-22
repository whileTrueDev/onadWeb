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

  // * 월별 정산 내역 조회
  async findAllMonthly(
    marketerId: string,
    year: string | number,
  ): Promise<Array<Omit<MarketerSalesIncomeSettlementLogs, 'doneDate'> & { doneDate: string }>> {
    const data = await this.marketerSalesIncomeSettlementLogsRepo
      .createQueryBuilder()
      .where('marketerId = :marketerId', { marketerId: 'cookmagic' })
      .andWhere('YEAR(doneDate) = :year', { year })
      .orderBy('doneDate', 'DESC')
      .getMany();

    return data.map(d => ({ ...d, doneDate: dayjs(d.doneDate).format('YYYY-MM') }));
  }

  // * 주문별 정산 내역 조회
  public async findAllByOrder(
    marketerId: string,
    year: string | number,
    month: string | number,
    roundInMonth: string | number,
  ): Promise<FindSettlementLogsRes> {
    const data = await this.marketerSalesIncomeSettlementLogsRepo
      .createQueryBuilder()
      .where('marketerId = :marketerId', { marketerId: 'cookmagic' })
      .andWhere('YEAR(doneDate) = :year', { year })
      .andWhere('MONTH(doneDate) = :month', { month })
      .andWhere('roundInMonth = :roundInMonth', { roundInMonth })
      .orderBy('doneDate', 'DESC')
      .getOne();

    return this.merchandiseOrdersDetailRepo._findSettlementBySettlementLogId(data.id);
  }

  // * settlementLogId에 따른 정산 내역 조회
  public async findAllById(settlementLogId: number): Promise<FindSettlementLogsRes> {
    return this.merchandiseOrdersDetailRepo._findSettlementBySettlementLogId(settlementLogId);
  }

  // * 정산 내역이 있는 년도 조회
  public async findYears(marketerId: string): Promise<string[]> {
    const data = await this.marketerSalesIncomeSettlementLogsRepo
      .createQueryBuilder()
      .select('YEAR(doneDate) AS year')
      .groupBy('YEAR(doneDate)')
      .orderBy('doneDate', 'DESC')
      .where('marketerId = :marketerId', { marketerId: 'cookmagic' })
      .getRawMany();
    return data.map(d => String(d.year));
  }

  // * 정산 내역이 있는 월 조회
  public async findMonths(marketerId: string, year: string): Promise<string[]> {
    const data = await this.marketerSalesIncomeSettlementLogsRepo
      .createQueryBuilder()
      .select('MONTH(doneDate) AS month')
      .groupBy('MONTH(doneDate)')
      .orderBy('doneDate', 'DESC')
      .where('marketerId = :marketerId', { marketerId: 'cookmagic' })
      .andWhere('YEAR(doneDate) = :year', { year })
      .getRawMany();

    return data.map(d => String(d.month));
  }

  // * 년도, 월의 정산 회차를 조회
  public async findRounds(marketerId: string, year: string, month: string): Promise<string[]> {
    const data = await this.marketerSalesIncomeSettlementLogsRepo
      .createQueryBuilder()
      .select('roundInMonth')
      .where('marketerId = :marketerId', { marketerId: 'cookmagic' })
      .andWhere('YEAR(doneDate) = :year', { year })
      .andWhere('MONTH(doneDate) = :month', { month })
      .groupBy('roundInMonth')
      .getRawMany();

    return data.map(d => String(d.roundInMonth));
  }
}
