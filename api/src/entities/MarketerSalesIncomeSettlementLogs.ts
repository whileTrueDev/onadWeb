import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('marketerSalesIncomeSettlementLogs', { schema: 'onadnode' })
export class MarketerSalesIncomeSettlementLogs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', {
    name: 'marketerId',
    comment: '마케터 고유 ID',
    length: 150,
    default: () => "''",
  })
  marketerId: string;

  @Column('int', {
    name: 'amount',
    comment: '판매대금 정산 금액',
    unsigned: true,
  })
  amount: number;

  @Column('int', {
    name: 'amountDeliveryFee',
    comment: '판매대금 중 정산 배송비',
    unsigned: true,
    default: () => "'0'",
  })
  amountDeliveryFee: number;

  @Column('timestamp', {
    name: 'createDate',
    comment: '판매대금 출금 신청 날짜',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date;

  @Column('timestamp', {
    name: 'doneDate',
    comment: '판매대금 출금 완료 날짜',
    default: () => 'CURRENT_TIMESTAMP',
  })
  doneDate: Date;

  @Column('varchar', {
    comment: '결제방법',
    length: 50,
  })
  paymentMethod: string;

  @Column('varchar', {
    comment: '구매채널(일반채널-응원메세지 없는경우, 방송인채널-응원메세지 있는경우)',
    default: '일반채널',
    length: 50,
  })
  purchaseChannel: string;

  @Column('int', {
    comment: '일반수수료(크리에이터+온애드)',
    default: 0,
    unsigned: true,
  })
  commissionAmount: number;

  @Column('int', {
    comment: '전자결제수수료(다날/iamport/...)',
    default: 0,
    unsigned: true,
  })
  paymentCommissionAmount: number;

  @Column('int', {
    comment: '부가세(일반수수료합 * 10%)',
    default: 0,
    unsigned: true,
  })
  VAT: number;

  @Column('int', {
    comment: '실지급액',
    default: 0,
    unsigned: true,
  })
  actualSendedAmount: number;

  @Column('varchar', {
    comment: '지급상태(지급완료, 지급예정, 취소매출)',
    default: '지급예정',
    length: 50,
  })
  sendStatus: string;

  @Column('timestamp', {
    comment: '주문일자',
    nullable: true,
  })
  orderDate?: Date;

  @Column('timestamp', {
    comment: '취소일자',
    nullable: true,
  })
  cancelDate?: Date;

  @Column('timestamp', {
    comment: '주문확정 일자',
    nullable: true,
  })
  purchaseConfirmDate?: Date;
}
