import { Column, Entity } from 'typeorm';

@Entity('creatorPrice', { schema: 'onadnode' })
export class CreatorPrice {
  @Column('varchar', { primary: true, name: 'creatorId', length: 50 })
  creatorId: string;

  @Column('int', { name: 'grade', default: () => "'0'" })
  grade: number;

  @Column('int', { name: 'viewerAverageCount', default: () => "'0'" })
  viewerAverageCount: number;

  @Column('int', { name: 'unitPrice', default: () => "'1'" })
  unitPrice: number;

  @Column('timestamp', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
