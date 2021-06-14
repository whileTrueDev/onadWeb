import { Column, Entity } from 'typeorm';

@Entity('twitchTag', { schema: 'onadnode' })
export class TwitchTag {
  @Column('varchar', {
    primary: true,
    name: 'tagId',
    length: 100,
    default: () => "''",
  })
  tagId: string;

  @Column('int', { name: 'isAuto', unsigned: true, default: () => "'0'" })
  isAuto: number;

  @Column('varchar', {
    name: 'nameKr',
    nullable: true,
    length: 50,
    default: () => "''",
  })
  nameKr: string | null;

  @Column('varchar', { name: 'nameUs', length: 50, default: () => "''" })
  nameUs: string;

  @Column('varchar', {
    name: 'descriptionKr',
    nullable: true,
    length: 255,
    default: () => "''",
  })
  descriptionKr: string | null;

  @Column('varchar', {
    name: 'descriptionUs',
    length: 255,
    default: () => "''",
  })
  descriptionUs: string;

  @Column('timestamp', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
