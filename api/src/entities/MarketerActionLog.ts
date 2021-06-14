import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('marketerActionLog', { schema: 'onadnode' })
export class MarketerActionLog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'marketerId', length: 50, default: () => "''" })
  marketerId: string;

  @Column('int', { name: 'type', nullable: true })
  type: number | null;

  @Column('text', { name: 'detail', nullable: true })
  detail: string | null;

  @Column('timestamp', {
    name: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date | null;
}
