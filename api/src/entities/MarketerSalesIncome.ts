import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('marketerSalesIncome', { schema: 'onadnode' })
export class MarketerSalesIncome {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', {
    name: 'marketerId',
    comment: '광고주ID',
    length: 150,
    default: () => "''",
  })
  marketerId: string;

  @Column('int', {
    name: 'totalIncome',
    comment: '총 판매수익금',
    unsigned: true,
  })
  totalIncome: number;

  @Column('int', {
    name: 'receivable',
    comment: '출금가능 판매수익금',
    unsigned: true,
  })
  receivable: number;

  @Column('timestamp', {
    name: 'createDate',
    comment: '판매대금 로그 생성일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date;

  @Column('int', {
    name: 'totalDeliveryFee',
    comment: '총 판매 배송비',
    unsigned: true,
    default: () => "'0'",
  })
  totalDeliveryFee: number;

  @Column('int', {
    name: 'receivableDeliveryFee',
    comment: '출금가능 판매수익금',
    unsigned: true,
    default: () => "'0'",
  })
  receivableDeliveryFee: number;
}
