import {
  Column, Entity, Index, PrimaryGeneratedColumn
} from 'typeorm';

@Index('createdAt_index', ['createdAt'], {})
@Index('broadCategory_index', ['broadCategory'], {})
@Index('broadId_index', ['broadId'], {})
@Entity('AfreecaBroadDetail_before', { schema: 'onadnode' })
export class AfreecaBroadDetailBefore {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', comment: '방송 제목', length: 255 })
  title: string;

  @Column('int', {
    name: 'visitBroadType',
    comment: '탐방 허용 상태, 0=탐방사절, 1=탐방허용',
  })
  visitBroadType: number;

  @Column('tinyint', {
    name: 'isPassword',
    comment: '비번방 상태, 0=비번방X, 1=비번방O',
  })
  isPassword: number;

  @Column('varchar', {
    name: 'broadThumb',
    comment: '방송 썸네일',
    length: 255,
  })
  broadThumb: string;

  @Column('varchar', {
    name: 'broadGrade',
    comment: '방송 등급, 19=연령제한, 0=일반',
    length: 255,
  })
  broadGrade: string;

  @Column('varchar', {
    name: 'broadBps',
    comment: '방송 화질, kbps단위',
    length: 255,
  })
  broadBps: string;

  @Column('varchar', {
    name: 'broadResolution',
    comment: '방송 해상도, 1280x720 or 1920x1080',
    length: 255,
  })
  broadResolution: string;

  @Column('int', { name: 'viewCount', comment: '총 시청자 수' })
  viewCount: number;

  @Column('datetime', {
    name: 'createdAt',
    default: () => "'current_timestamp(6)'",
  })
  createdAt: Date;

  @Column('varchar', { name: 'broadCategory', nullable: true, length: 255 })
  broadCategory: string | null;

  @Column('varchar', { name: 'broadId', nullable: true, length: 255 })
  broadId: string | null;
}
