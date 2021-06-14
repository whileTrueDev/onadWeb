import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bannerVisible', { schema: 'onadnode' })
export class BannerVisible {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'advertiseUrl', length: 50 })
  advertiseUrl: string;

  @Column('int', { name: 'visibleState' })
  visibleState: number;

  @Column('varchar', { name: 'program', length: 50 })
  program: string;

  @Column('varchar', { name: 'type', nullable: true, length: 50 })
  type: string | null;

  @Column('timestamp', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
