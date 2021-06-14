import { Column, Entity } from 'typeorm';

@Entity('creatorDetail', { schema: 'onadnode' })
export class CreatorDetail {
  @Column('varchar', { primary: true, name: 'creatorId', length: 50 })
  creatorId: string;

  @Column('int', { name: 'followers', nullable: true })
  followers: number | null;

  @Column('int', { name: 'viewer', nullable: true })
  viewer: number | null;

  @Column('int', { name: 'peakview', nullable: true })
  peakview: number | null;

  @Column('int', { name: 'airtime', nullable: true })
  airtime: number | null;

  @Column('int', { name: 'impression', nullable: true })
  impression: number | null;

  @Column('float', { name: 'ctr', nullable: true, precision: 12 })
  ctr: number | null;

  @Column('int', { name: 'cost', nullable: true })
  cost: number | null;

  @Column('float', { name: 'rip', nullable: true, precision: 12 })
  rip: number | null;

  @Column('varchar', { name: 'content', nullable: true, length: 255 })
  content: string | null;

  @Column('varchar', { name: 'openHour', nullable: true, length: 50 })
  openHour: string | null;

  @Column('text', { name: 'timeGraphData', nullable: true })
  timeGraphData: string | null;

  @Column('text', { name: 'contentsGraphData', nullable: true })
  contentsGraphData: string | null;

  @Column('timestamp', {
    name: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date | null;

  @Column('text', { name: 'viewerHeatmapData', nullable: true })
  viewerHeatmapData: string | null;
}
