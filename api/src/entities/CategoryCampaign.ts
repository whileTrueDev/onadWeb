import { Column, Entity } from 'typeorm';

@Entity('categoryCampaign', { schema: 'onadnode' })
export class CategoryCampaign {
  @Column('varchar', {
    primary: true,
    name: 'categoryId',
    length: 11,
    default: () => "''",
  })
  categoryId: string;

  @Column('varchar', { name: 'categoryName', nullable: true, length: 50 })
  categoryName: string | null;

  @Column('mediumtext', { name: 'campaignList', nullable: true })
  campaignList: string | null;

  @Column('varchar', { name: 'emoji', nullable: true, length: 20 })
  emoji: string | null;

  @Column('int', { name: 'state', nullable: true, default: () => "'1'" })
  state: number | null;

  @Column('varchar', { name: 'platform', nullable: true, length: 50 })
  platform: string | null;
}
