import { Column, Entity } from 'typeorm';

@Entity('creatorCampaign', { schema: 'onadnode' })
export class CreatorCampaign {
  @Column('varchar', { primary: true, name: 'creatorId', length: 50 })
  creatorId: string;

  @Column('text', { name: 'campaignList', nullable: true })
  campaignList: string | null;

  @Column('text', { name: 'banList', nullable: true })
  banList: string | null;

  @Column('text', { name: 'pausedList', nullable: true })
  pausedList: string | null;
}
