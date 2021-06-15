import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MerchandiseOrdersDetail } from './MerchandiseOrdersDetail';

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

  @OneToOne(
    () => MerchandiseOrdersDetail,
    mod => mod.settlementLog,
  )
  orderDetail: number;
}
