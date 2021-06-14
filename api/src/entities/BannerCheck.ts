import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bannerCheck', { schema: 'onadnode' })
export class BannerCheck {
  @PrimaryGeneratedColumn({ type: 'int', name: 'code' })
  code: number;

  @Column('varchar', { name: 'creatorId', nullable: true, length: 50 })
  creatorId: string | null;

  @Column('int', { name: 'state', nullable: true, default: () => "'0'" })
  state: number | null;

  @Column('timestamp', {
    name: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date | null;
}
