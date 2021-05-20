import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('marketerNotification', { schema: 'onadnode' })
export class MarketerNotification {
  @PrimaryGeneratedColumn({ type: 'int', name: 'index' })
  index: number;

  @Column('varchar', { name: 'marketerId', nullable: true, length: 50 })
  marketerId: string | null;

  @Column('varchar', { name: 'title', nullable: true, length: 50 })
  title: string | null;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;

  @Column('int', { name: 'readState', nullable: true, default: () => "'0'" })
  readState: number | null;

  @Column('timestamp', {
    name: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date | null;
}
