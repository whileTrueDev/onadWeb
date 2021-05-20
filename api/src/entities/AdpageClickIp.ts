import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('adpageClickIp', { schema: 'onadnode' })
export class AdpageClickIp {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('tinyint', { name: 'type', nullable: true, unsigned: true })
  type: number | null;

  @Column('varchar', { name: 'ipAddress', length: 20 })
  ipAddress: string;

  @Column('varchar', {
    name: 'campaignId',
    nullable: true,
    length: 50,
    default: () => "''",
  })
  campaignId: string | null;

  @Column('varchar', { name: 'creatorId', length: 50, default: () => "''" })
  creatorId: string;

  @Column('timestamp', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
