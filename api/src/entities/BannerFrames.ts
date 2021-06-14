import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bannerFrames', { schema: 'onadnode' })
export class BannerFrames {
  @PrimaryGeneratedColumn({ type: 'int', name: 'code' })
  code: number;

  @Column('varchar', { name: 'bannerId', nullable: true, length: 50 })
  bannerId: string | null;

  @Column('longtext', { name: 'bannerSrc', nullable: true })
  bannerSrc: string | null;
}
