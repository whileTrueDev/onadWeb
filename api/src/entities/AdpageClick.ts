import { Column, Entity } from 'typeorm';

@Entity('adpageClick', { schema: 'onadnode' })
export class AdpageClick {
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

  @Column('tinyint', { name: 'state', width: 1, default: () => "'1'" })
  state: boolean;

  @Column('timestamp', { name: 'regiDate', default: () => 'CURRENT_TIMESTAMP' })
  regiDate: Date;
}
