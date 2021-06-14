import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('loginStamp', { schema: 'onadnode' })
export class LoginStamp {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'userId', nullable: true, length: 50 })
  userId: string | null;

  @Column('varchar', { name: 'userIp', nullable: true, length: 50 })
  userIp: string | null;

  @Column('int', { name: 'userType', nullable: true })
  userType: number | null;

  @Column('timestamp', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
