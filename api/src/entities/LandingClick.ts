import { Column, Entity } from 'typeorm';

@Entity('landingClick', { schema: 'onadnode' })
export class LandingClick {
  @Column('varchar', {
    primary: true,
    name: 'campaignId',
    length: 50,
    default: () => "''",
  })
  campaignId: string;

  @Column('varchar', {
    primary: true,
    name: 'creatorId',
    length: 50,
    default: () => "''",
  })
  creatorId: string;

  @Column('int', { name: 'clickCount', default: () => "'0'" })
  clickCount: number;

  @Column('int', { name: 'transferCount', default: () => "'0'" })
  transferCount: number;

  @Column('timestamp', { name: 'regiDate', default: () => 'CURRENT_TIMESTAMP' })
  regiDate: Date;
}
