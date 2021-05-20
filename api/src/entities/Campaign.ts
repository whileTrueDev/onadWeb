import { Column, Entity, Index } from 'typeorm';

@Index('marketerId_index', ['marketerId'], {})
@Entity('campaign', { schema: 'onadnode' })
export class Campaign {
  @Column('varchar', {
    primary: true,
    name: 'campaignId',
    length: 50,
    default: () => "''",
  })
  campaignId: string;

  @Column('varchar', { name: 'campaignName', length: 50 })
  campaignName: string;

  @Column('varchar', { name: 'marketerId', length: 50 })
  marketerId: string;

  @Column('varchar', { name: 'marketerName', length: 50, default: () => "''" })
  marketerName: string;

  @Column('varchar', { name: 'bannerId', length: 50 })
  bannerId: string;

  @Column('varchar', { name: 'connectedLinkId', nullable: true, length: 50 })
  connectedLinkId: string | null;

  @Column('int', { name: 'dailyLimit', default: () => "'-1'" })
  dailyLimit: number;

  @Column('int', { name: 'limitState', default: () => "'0'" })
  limitState: number;

  @Column('int', { name: 'priorityType', default: () => "'0'" })
  priorityType: number;

  @Column('int', {
    name: 'optionType',
    comment:
      '광고유형 (0=CPM(중단됨), 1=생방송배너광고, 2=CPC(중단됨), 3=판매형 광고)',
    default: () => "'0'",
  })
  optionType: number;

  @Column('int', { name: 'onOff', unsigned: true, default: () => "'0'" })
  onOff: number;

  @Column('int', { name: 'deletedState', default: () => "'0'" })
  deletedState: number;

  @Column('timestamp', { name: 'regiDate', default: () => 'CURRENT_TIMESTAMP' })
  regiDate: Date;

  @Column('timestamp', {
    name: 'updateDate',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateDate: Date;

  @Column('timestamp', { name: 'stopDate', nullable: true })
  stopDate: Date | null;

  @Column('text', { name: 'targetList', nullable: true })
  targetList: string | null;

  @Column('text', { name: 'keyword', nullable: true })
  keyword: string | null;

  @Column('timestamp', { name: 'startDate', nullable: true })
  startDate: Date | null;

  @Column('timestamp', { name: 'finDate', nullable: true })
  finDate: Date | null;

  @Column('varchar', { name: 'selectedTime', nullable: true, length: 255 })
  selectedTime: string | null;

  @Column('varchar', {
    name: 'campaignDescription',
    nullable: true,
    length: 50,
  })
  campaignDescription: string | null;

  @Column('int', {
    name: 'merchandiseId',
    nullable: true,
    comment: '연결된 상품 ID (CPS전용, merchandiseRegistered)',
  })
  merchandiseId: number | null;
}
