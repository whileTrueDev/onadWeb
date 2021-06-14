import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('creatorWithdrawal', { schema: 'onadnode' })
export class CreatorWithdrawal {
  @PrimaryGeneratedColumn({ type: 'int', name: 'index' })
  index: number;

  @Column('varchar', { name: 'creatorId', length: 50 })
  creatorId: string;

  @Column('int', { name: 'creatorWithdrawalAmount', default: () => "'0'" })
  creatorWithdrawalAmount: number;

  @Column('timestamp', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('int', { name: 'withdrawalState', default: () => "'0'" })
  withdrawalState: number;
}
