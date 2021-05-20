import { Column, Entity } from 'typeorm';

@Entity('creatorLanding', { schema: 'onadnode' })
export class CreatorLanding {
  @Column('varchar', {
    primary: true,
    name: 'creatorId',
    length: 50,
    default: () => "''",
  })
  creatorId: string;

  @Column('varchar', { name: 'creatorTwitchId', nullable: true, length: 50 })
  creatorTwitchId: string | null;

  @Column('varchar', { name: 'creatorDesc', length: 100, default: () => "''" })
  creatorDesc: string;

  @Column('longtext', { name: 'creatorBackgroundImage', nullable: true })
  creatorBackgroundImage: string | null;

  @Column('varchar', {
    name: 'creatorTheme',
    length: 11,
    default: () => "'light'",
  })
  creatorTheme: string;
}
