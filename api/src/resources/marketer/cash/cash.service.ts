import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerCharge } from '../../../entities/MarketerCharge';
import { MarketerDebit } from '../../../entities/MarketerDebit';
import { ChargeHistoryResObj } from './interfaces/chargeHistoryRes.interface';

@Injectable()
export class CashService {
  constructor(
    @InjectRepository(MarketerDebit) private readonly marketerDebitRepo: Repository<MarketerDebit>,
    @InjectRepository(MarketerCharge)
    private readonly marketerChargeRepo: Repository<MarketerCharge>,
  ) {}

  // * 광고주 광고 캐시 조회
  async findCashAmount(marketerId: string): Promise<Pick<MarketerDebit, 'cashAmount' | 'date'>> {
    return this.marketerDebitRepo
      .createQueryBuilder()
      .select('FORMAT(cashAmount, 0) as cashAmount, date')
      .where('marketerId = :marketerId', { marketerId })
      .orderBy('date', 'DESC')
      .getRawOne();
  }

  async charge() {
    //
  }

  async chargeCard() {
    //
  }

  async refund() {
    //
  }

  async updateChargeVbankState() {
    //
  }

  // **************************
  // * history 캐시 충전 및 사용 내역
  // **************************

  // * 캐시 충전 내역 테이블 데이터
  async findChargeHistory(marketerId: string): Promise<string[][]> {
    const result = (await this.marketerChargeRepo
      .createQueryBuilder()
      .select('DATE_FORMAT(date, "%y년 %m월 %d일 %T") as date')
      .addSelect('FORMAT(ROUND(cash), 0) as cash, type, temporaryState')
      .where('marketerId = :marketerId', { marketerId })
      .orderBy('date', 'DESC')
      .getRawMany()) as MarketerCharge[];

    const sendArray: string[][] = [];
    result.forEach(queryResult => {
      const object: Partial<ChargeHistoryResObj> = {};
      object.cash = String(queryResult.cash);
      if (queryResult.type === 'vbank') object.type = '가상계좌';
      else if (queryResult.type === 'trans') object.type = '계좌이체';
      else if (queryResult.type === 'card') object.type = '신용카드';
      switch (queryResult.temporaryState) {
        case 1:
          object.temporaryState = '완료됨';
          break;
        case 2:
          object.temporaryState = '취소됨';
          break;
        default:
          object.temporaryState = '진행중';
          break;
      }
      sendArray.push(Object.values(object));
    });
    return sendArray;
  }

  async findRefundHistory() {
    //
  }

  async findUsageHistory() {
    //
  }

  async findUsageHistoryMohthly() {
    //
  }
}
