import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('creatorIncome', { schema: 'onadnode' })
export class CreatorIncome {
  @PrimaryGeneratedColumn({ type: 'int', name: 'code' })
  code: number;

  @Column('varchar', { name: 'creatorId', length: 50 })
  creatorId: string;

  @Column('float', {
    name: 'creatorTotalIncome',
    precision: 12,
    default: () => "'0'",
  })
  creatorTotalIncome: number;

  @Column('float', {
    name: 'creatorReceivable',
    precision: 12,
    default: () => "'0'",
  })
  creatorReceivable: number;

  @Column('timestamp', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
