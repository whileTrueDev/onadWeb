import { Column, Entity } from 'typeorm';

@Entity('linkRegistered', { schema: 'onadnode' })
export class LinkRegistered {
  @Column('varchar', {
    primary: true,
    name: 'linkId',
    length: 50,
    default: () => "''",
  })
  linkId: string;

  @Column('varchar', { name: 'marketerId', nullable: true, length: 50 })
  marketerId: string | null;

  @Column('int', { name: 'confirmState', nullable: true, default: () => "'0'" })
  confirmState: number | null;

  @Column('varchar', { name: 'denialReason', nullable: true, length: 100 })
  denialReason: string | null;

  @Column('text', { name: 'links', nullable: true })
  links: string | null;

  @Column('timestamp', { name: 'regiDate', default: () => 'CURRENT_TIMESTAMP' })
  regiDate: Date;

  @Column('timestamp', {
    name: 'updateDate',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateDate: Date;
}
