import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('afreecacreators', { schema: 'onadnode' })
export class Afreecacreators {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'creatorId', nullable: true, length: 100 })
  creatorId: string | null;

  @Column('int', { name: 'is_live', default: () => "'0'" })
  isLive: number;

  @Column('timestamp', { name: 'startAt', nullable: true })
  startAt: Date | null;

  @Column('varchar', { name: 'creatorName', nullable: true, length: 100 })
  creatorName: string | null;

  @Column('timestamp', { name: 'endAt', nullable: true })
  endAt: Date | null;

  @Column('varchar', { name: 'resolution', nullable: true, length: 11 })
  resolution: string | null;

  @Column('varchar', { name: 'videoQuality', nullable: true, length: 11 })
  videoQuality: string | null;
}
