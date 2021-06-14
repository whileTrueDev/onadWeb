import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('marketerRefund', { schema: 'onadnode' })
export class MarketerRefund {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'marketerId', length: 50, default: () => "''" })
  marketerId: string;

  @Column('int', { name: 'cash', default: () => "'0'" })
  cash: number;

  @Column('timestamp', {
    name: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date | null;

  @Column('int', { name: 'check', default: () => "'0'" })
  check: number;
}
