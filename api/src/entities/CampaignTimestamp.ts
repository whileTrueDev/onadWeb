import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('campaignTimestamp', { schema: 'onadnode' })
export class CampaignTimestamp {
  @PrimaryGeneratedColumn({ type: 'int', name: 'code' })
  code: number;

  @Column('varchar', { name: 'campaignId', length: 50, default: () => "''" })
  campaignId: string;

  @Column('varchar', { name: 'creatorId', length: 50 })
  creatorId: string;

  @Column('varchar', { name: 'program', nullable: true, length: 50 })
  program: string | null;

  @Column('timestamp', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
