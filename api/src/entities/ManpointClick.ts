import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('manpointClick', { schema: 'onadnode' })
export class ManpointClick {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'creatorId', nullable: true, length: 50 })
  creatorId: string | null;

  @Column('varchar', { name: 'ipAddress', nullable: true, length: 20 })
  ipAddress: string | null;

  @Column('tinyint', { name: 'type', nullable: true })
  type: number | null;

  @Column('timestamp', {
    name: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date | null;
}
