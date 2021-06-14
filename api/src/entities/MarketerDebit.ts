import { Column, Entity } from 'typeorm';

@Entity('marketerDebit', { schema: 'onadnode' })
export class MarketerDebit {
  @Column('varchar', {
    primary: true,
    name: 'marketerId',
    length: 50,
    default: () => "''",
  })
  marketerId: string;

  @Column('double', { name: 'unitPrice', precision: 22, default: () => "'1'" })
  unitPrice: number;

  @Column('float', { name: 'cashAmount', precision: 12 })
  cashAmount: number;

  @Column('int', { name: 'warning', default: () => "'0'" })
  warning: number;

  @Column('timestamp', {
    name: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date | null;
}
