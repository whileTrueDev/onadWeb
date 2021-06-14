import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('marketerCharge', { schema: 'onadnode' })
export class MarketerCharge {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'marketerId', length: 50, default: () => "''" })
  marketerId: string;

  @Column('varchar', { name: 'type', length: 50, default: () => "''" })
  type: string;

  @Column('int', { name: 'cash', nullable: true })
  cash: number | null;

  @Column('varchar', { name: 'name', length: 50 })
  name: string;

  @Column('timestamp', {
    name: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date | null;

  @Column('varchar', { name: 'merchant_uid', length: 50 })
  merchantUid: string;

  @Column('varchar', { name: 'imp_uid', length: 50 })
  impUid: string;

  @Column('int', { name: 'temporaryState', default: () => "'0'" })
  temporaryState: number;

  @Column('varchar', { name: 'vbanknum', length: 50 })
  vbanknum: string;

  @Column('varchar', { name: 'vbankName', length: 50 })
  vbankName: string;

  @Column('varchar', { name: 'vbankDueDate', length: 50 })
  vbankDueDate: string;
}
