import { Column, Entity } from 'typeorm';

@Entity('creatorRoyaltyLevel', { schema: 'onadnode' })
export class CreatorRoyaltyLevel {
  @Column('varchar', {
    primary: true,
    name: 'creatorId',
    length: 50,
    default: () => "''",
  })
  creatorId: string;

  @Column('int', { name: 'level', default: () => "'0'" })
  level: number;

  @Column('int', { name: 'exp', default: () => "'0'" })
  exp: number;

  @Column('int', { name: 'visitCount', nullable: true, default: () => "'0'" })
  visitCount: number | null;
}
