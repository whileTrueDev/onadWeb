import {
  Column, Entity, Index, PrimaryGeneratedColumn
} from 'typeorm';

@Index('campaignId_index', ['campaignId'], {})
@Entity('campaignLog', { schema: 'onadnode' })
export class CampaignLog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'campaignId', length: 50, default: () => "''" })
  campaignId: string;

  @Column('varchar', { name: 'creatorId', length: 50 })
  creatorId: string;

  @Column('varchar', { name: 'type', length: 10, default: () => "'CPM'" })
  type: string;

  @Column('float', { name: 'cashFromMarketer', nullable: true, precision: 12 })
  cashFromMarketer: number | null;

  @Column('float', { name: 'cashToCreator', nullable: true, precision: 12 })
  cashToCreator: number | null;

  @Column('int', { name: 'viewer', nullable: true })
  viewer: number | null;

  @Column('timestamp', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('int', { name: 'twitchVIewer', nullable: true })
  twitchVIewer: number | null;

  @Column('int', { name: 'afreecaViewer', nullable: true })
  afreecaViewer: number | null;

  @Column('float', {
    name: 'salesIncomeToMarketer',
    nullable: true,
    comment: '광고주CPS판매대금',
    precision: 12,
  })
  salesIncomeToMarketer: number | null;
}
