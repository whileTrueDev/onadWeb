import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('marketerTaxBill', { schema: 'onadnode' })
export class MarketerTaxBill {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'marketerId', length: 50, default: () => "''" })
  marketerId: string;

  @Column('date', { name: 'date' })
  date: string;

  @Column('int', { name: 'state', default: () => "'0'" })
  state: number;

  @Column('int', { name: 'cashAmount', nullable: true, default: () => "'0'" })
  cashAmount: number | null;

  @Column('timestamp', {
    name: 'updateDate',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateDate: Date;
}
