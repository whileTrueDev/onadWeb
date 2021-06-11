/* eslint-disable camelcase */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Connection, Repository } from 'typeorm';
import { IamportPaymentResponse, IamportService } from '../../../api/iamport/iamport.service';
import { MarketerCharge } from '../../../entities/MarketerCharge';
import { MarketerDebit } from '../../../entities/MarketerDebit';
import { MarketerRefund } from '../../../entities/MarketerRefund';
import { transactionQuery } from '../../../utils/transactionQuery';
import { MarketerCashCargeDto } from './dto/marketerCashCargeDto.dto';
import { MarketerCashChargeByCardDto } from './dto/marketerCashChargeByCardDto.dto';
import { MarketerChargeRes } from './interfaces/marketerChargeRes.interface';

export interface ChargeParams {
  marketerId: string;
  chargeCash: number;
  chargeType: string;
  merchant_uid: string;
  imp_uid: string;
  paymentData?: IamportPaymentResponse;
}
@Injectable()
export class CashService {
  constructor(
    @InjectRepository(MarketerDebit) private readonly marketerDebitRepo: Repository<MarketerDebit>,
    @InjectRepository(MarketerCharge)
    private readonly marketerChargeRepo: Repository<MarketerCharge>,
    @InjectRepository(MarketerRefund)
    private readonly marketerRefundRepo: Repository<MarketerRefund>,
    private readonly iamportService: IamportService,
    private readonly connection: Connection,
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

  // * 광고주 캐시 충전
  async charge(marketerId: string, dto: MarketerCashCargeDto): Promise<MarketerCharge> {
    const chargeCash = Number(dto.chargeCash);
    const row = this.marketerChargeRepo.create({
      marketerId,
      cash: chargeCash,
      type: dto.chargeType,
    });
    return this.marketerChargeRepo.save(row);
  }

  // * 광고주 카드 캐시 충전
  async chargeCard(
    marketerId: string,
    dto: MarketerCashChargeByCardDto,
  ): Promise<MarketerChargeRes> {
    const chargeCash = Number(dto.chargeCash);

    // 결제시스템의 액세스 토큰(access token) 발급 받기 => 결제 위변조를 대조 용도도 포함
    const { access_token } = await this.iamportService.getToken(); // 접속 인증 토큰

    // imp_uid로 아임포트 서버에서 결제 정보 조회하여, 실제로 사용자가 전송한 금액과 그 상태를 조회
    const paymentData = await this.iamportService.getPaymentData(dto.imp_uid, access_token);

    const { amount, status } = paymentData;
    if (this.checkChargeAmountIsValid(chargeCash, amount)) {
      switch (status) {
        // 가상계좌 발급 로직
        case 'ready': {
          return this.chargeVbank({
            marketerId,
            chargeCash,
            chargeType: dto.chargeType,
            imp_uid: dto.imp_uid,
            merchant_uid: dto.merchant_uid,
            paymentData,
          });
        }
        // 계좌이체 및 신용카드 결제 로직
        case 'paid': {
          return this.chargeCommon({
            marketerId,
            chargeCash,
            chargeType: dto.chargeType,
            imp_uid: dto.imp_uid,
            merchant_uid: dto.merchant_uid,
            paymentData,
          });
        }
        default:
          throw new InternalServerErrorException('status가 정의되지 않았습니다.');
      }
    }
    return null;
  }

  // * 환불 생성
  async refund(marketerId: string, withdrawCash: number): Promise<boolean> {
    let withFeeRefundCash;
    if (withdrawCash < 10000) {
      withFeeRefundCash = withdrawCash - 1000;
    } else {
      withFeeRefundCash = withdrawCash * 0.9;
    }

    // 현재 마케터의 캐시 보유량 조회
    const debit = await this.marketerDebitRepo.findOne({
      where: { marketerId },
      order: { date: 'DESC' },
    });

    return transactionQuery(this.connection, async queryRunner => {
      // 마케터 캐시 보유량 수정 ( 환불진행한 만큼 차감 )
      await this.marketerDebitRepo
        .createQueryBuilder('md', queryRunner)
        .update()
        .set({ cashAmount: debit.cashAmount - withdrawCash })
        .where('marketerId = :marketerId', { marketerId })
        .execute();
      // 환불 내역에 데이터 적재
      const newRefund = this.marketerRefundRepo.create({
        marketerId,
        cash: withFeeRefundCash,
        check: 0,
      });
      await queryRunner.manager.insert(MarketerRefund, newRefund);
      return true;
    });
  }

  // * 가상계좌 상태 업데이트
  async updateChargeVbankState(marketerId: string): Promise<boolean> {
    const result = await this.marketerChargeRepo
      .createQueryBuilder()
      .update()
      .set({ temporaryState: 2 })
      .where('marketerId = :marketerId', { marketerId })
      .andWhere('type = :type', { type: 'vbank' })
      .andWhere('(NOW() > vbankDueDate)')
      .andWhere('temporaryState = 0')
      .execute();

    if (result.affected > 0) return true;
    return false;
  }

  // ********************************
  // * Private methods
  // ********************************
  // 가상계좌 생성
  private async chargeVbank({
    marketerId,
    paymentData,
    chargeCash,
    chargeType,
    merchant_uid,
    imp_uid,
  }: ChargeParams): Promise<MarketerChargeRes | null> {
    // * 가상계좌 발급 시 로직 (DB에 가상계좌 발급 정보 저장)
    const { vbank_num, vbank_date, vbank_name, vbank_holder } = paymentData;

    // 마케터 현재 보유금액 조회
    const currentDebit = await this.marketerDebitRepo.findOne({
      where: { marketerId },
      order: { date: 'DESC' },
    });

    if (currentDebit) {
      // 충전 금액 row 추가
      const obj = this.marketerChargeRepo.create({
        marketerId,
        cash: chargeCash,
        type: chargeType,
        merchantUid: merchant_uid,
        impUid: imp_uid,
        temporaryState: 0,
        vbanknum: vbank_num,
        vbankName: vbank_name,
        vbankDueDate: dayjs(vbank_date).format('YYYY-MM-DD hh:mm:ss'),
      });
      await this.marketerChargeRepo.save(obj);
      return {
        status: 'vbankIssued',
        vbank_num: `${vbank_num}`,
        vbank_date: `${vbank_date}`,
        vbank_name: `${vbank_name}`,
        vbank_holder: `${vbank_holder}`,
        chargedCashAmount: paymentData.amount,
      };
    }
    return null;
  }

  // * 계좌이체 및 신용카드 통한 일반 캐시 충전
  private async chargeCommon({
    marketerId,
    paymentData,
    chargeCash,
    chargeType,
    merchant_uid,
    imp_uid,
  }: ChargeParams): Promise<MarketerChargeRes | null> {
    // 마케터 현재 보유금액 조회
    const currentDebit = await this.marketerDebitRepo.findOne({
      where: { marketerId },
      order: { date: 'DESC' },
    });
    if (!currentDebit) return null;

    return transactionQuery(
      this.connection,
      async queryRunner => {
        // 신용카드 및 계좌이체로 row 한줄 생성
        const obj = this.marketerChargeRepo.create({
          marketerId,
          cash: chargeCash,
          type: chargeType,
          merchantUid: merchant_uid,
          impUid: imp_uid,
          temporaryState: 1,
        });
        await queryRunner.manager.save(MarketerCharge, obj);
        // 충전시 기존의 캐시량 + 캐시충전량으로 바로 update
        const cashAmount = currentDebit.cashAmount + chargeCash;
        await queryRunner.manager
          .createQueryBuilder(MarketerDebit, 'md')
          .update()
          .set({ cashAmount })
          .where('marketerId = :marketerId', { marketerId })
          .execute();
        return {
          status: 'success',
          message: '일반 결제 성공',
          chargedCashAmount: paymentData.amount,
        };
      },
      { errorMessage: 'error occurred during - 계좌이체 및 신용카드 통한 일반 캐시 충전' },
    );
  }

  // * 충전 요청받은 데이터와 응답받은 iamport 데이터와 비교
  private checkChargeAmountIsValid(requested: number, iamportResponded: number | string): boolean {
    if (typeof iamportResponded === 'number') {
      return requested * 1.1 === iamportResponded;
    }
    return requested * 1.1 === parseInt(iamportResponded, 10);
  }
}
