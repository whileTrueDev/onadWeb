import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tracking', { schema: 'onadnode' })
export class Tracking {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('timestamp', {
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'clickedTime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  clickedTime: Date;

  @Column('timestamp', { name: 'conversionTime', nullable: true })
  conversionTime: Date | null;

  @Column('varchar', {
    name: 'costType',
    nullable: true,
    comment: '(CPM, CPC, CPA, CPS)',
    length: 50,
  })
  costType: string | null;

  @Column('varchar', { name: 'linkId', nullable: true, length: 50 })
  linkId: string | null;

  @Column('varchar', { name: 'marketerId', nullable: true, length: 50 })
  marketerId: string | null;

  @Column('varchar', { name: 'campaignId', nullable: true, length: 100 })
  campaignId: string | null;

  @Column('varchar', { name: 'campaignName', nullable: true, length: 150 })
  campaignName: string | null;

  @Column('varchar', { name: 'creatorId', nullable: true, length: 50 })
  creatorId: string | null;

  @Column('varchar', { name: 'creatorTwitchId', nullable: true, length: 100 })
  creatorTwitchId: string | null;

  @Column('varchar', { name: 'creatorAfreecaId', nullable: true, length: 100 })
  creatorAfreecaId: string | null;

  @Column('varchar', { name: 'ip', nullable: true, length: 50 })
  ip: string | null;

  @Column('varchar', { name: 'device', nullable: true, length: 100 })
  device: string | null;

  @Column('varchar', { name: 'os', nullable: true, length: 50 })
  os: string | null;

  @Column('varchar', { name: 'os_version', nullable: true, length: 50 })
  osVersion: string | null;

  @Column('varchar', { name: 'browser', nullable: true, length: 100 })
  browser: string | null;

  @Column('varchar', { name: 'browser_version', nullable: true, length: 100 })
  browserVersion: string | null;

  @Column('varchar', { name: 'browser_engine', nullable: true, length: 50 })
  browserEngine: string | null;

  @Column('varchar', {
    name: 'browser_engine_version',
    nullable: true,
    length: 50,
  })
  browserEngineVersion: string | null;

  @Column('int', { name: 'payout', nullable: true })
  payout: number | null;

  @Column('varchar', { name: 'channel', nullable: true, length: 50 })
  channel: string | null;
}
