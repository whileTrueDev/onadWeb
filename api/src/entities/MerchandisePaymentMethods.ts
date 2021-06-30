import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('merchandisePaymentMethods', { schema: 'onadnode' })
export class MerchandisePaymentMethods {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'method', comment: '결제 방법' })
  method: string;

  @Column('float', {
    name: 'paymentFee',
    comment: '결제수단 수수료 (%)',
    unsigned: true,
  })
  paymentFee: number;

  @Column('int', {
    name: 'paymentFeeFixed',
    comment: '결제수단 수수료 고정금 (원)',
    unsigned: true,
  })
  paymentFeeFixed: number;
}
