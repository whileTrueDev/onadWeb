import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('adPickCampaign', { schema: 'onadnode' })
export class AdPickCampaign {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'apOffer', length: 255 })
  apOffer: string;

  @Column('varchar', { name: 'apType', length: 255 })
  apType: string;

  @Column('varchar', { name: 'apCategory', length: 255 })
  apCategory: string;

  @Column('varchar', { name: 'apPackage', nullable: true, length: 255 })
  apPackage: string | null;

  @Column('varchar', { name: 'apItemid', nullable: true, length: 255 })
  apItemid: string | null;

  @Column('varchar', { name: 'apAppTitle', nullable: true, length: 255 })
  apAppTitle: string | null;

  @Column('varchar', { name: 'apHeadline', nullable: true, length: 255 })
  apHeadline: string | null;

  @Column('varchar', { name: 'apVideo', length: 255 })
  apVideo: string;

  @Column('varchar', { name: 'apDailyCap', length: 255 })
  apDailyCap: string;

  @Column('int', { name: 'apRemain' })
  apRemain: number;

  @Column('varchar', { name: 'apOS', nullable: true, length: 255 })
  apOs: string | null;

  @Column('varchar', { name: 'apAppPromoText', nullable: true, length: 255 })
  apAppPromoText: string | null;

  @Column('varchar', { name: 'apKPI', nullable: true, length: 255 })
  apKpi: string | null;

  @Column('varchar', { name: 'apPartner', nullable: true, length: 255 })
  apPartner: string | null;

  @Column('longtext', { name: 'apImages', nullable: true })
  apImages: string | null;

  @Column('varchar', { name: 'apTrackingLink', length: 255 })
  apTrackingLink: string;

  @Column('varchar', { name: 'apHook', length: 255 })
  apHook: string;

  @Column('varchar', { name: 'apEvent', length: 255 })
  apEvent: string;

  @Column('int', { name: 'apPayout' })
  apPayout: number;

  @Column('int', { name: 'apIOSPayout', nullable: true })
  apIosPayout: number | null;

  @Column('datetime', {
    name: 'createdAt',
    default: () => "'current_timestamp(6)'",
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updatedAt',
    default: () => "'current_timestamp(6)'",
  })
  updatedAt: Date;
}
