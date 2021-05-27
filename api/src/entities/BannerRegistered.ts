import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';

@Entity('bannerRegistered', { schema: 'onadnode' })
export class BannerRegistered {
  @Column('varchar', { primary: true, name: 'bannerId', length: 50 })
  bannerId: string;

  @Column('varchar', { name: 'marketerId', length: 50 })
  marketerId: string;

  @Exclude()
  @Column('longtext', { name: 'bannerSrc' })
  bannerSrc: string;

  @Column('int', {
    name: 'confirmState',
    default: () => "'0'",
    comment: '배너 등록 상태 (0: waiting, 1: completed,  2: denied)',
  })
  confirmState: number;

  @Column('varchar', { name: 'bannerDenialReason', nullable: true, length: 50 })
  bannerDenialReason: string | null;

  @Column('varchar', {
    name: 'bannerDescription',
    length: 100,
    default: () => "''",
  })
  bannerDescription: string;

  @Column('varchar', {
    name: 'companyDescription',
    length: 100,
    default: () => "''",
  })
  companyDescription: string;

  @Column('varchar', { name: 'landingUrl', nullable: true, length: 255 })
  landingUrl: string | null;

  @Column('varchar', {
    name: 'bannerCategory',
    length: 50,
    default: () => "'any'",
  })
  bannerCategory: string;

  @Column('timestamp', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('timestamp', { name: 'regiDate', default: () => 'CURRENT_TIMESTAMP' })
  regiDate: Date;

  @Column('text', { name: 'bannerSrcUrl' })
  bannerSrcUrl: string;
}
