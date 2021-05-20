import {
  Column, Entity, Index, PrimaryGeneratedColumn
} from 'typeorm';

@Index('twitch_chat_time_index', ['time'], {})
@Entity('twitchChat', { schema: 'onadnode' })
export class TwitchChat {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'creatorId', length: 50, default: () => "''" })
  creatorId: string;

  @Column('timestamp', { name: 'time', default: () => 'CURRENT_TIMESTAMP' })
  time: Date;

  @Column('varchar', { name: 'name', length: 11, default: () => "''" })
  name: string;

  @Column('varchar', { name: 'userId', length: 11, default: () => "''" })
  userId: string;

  @Column('tinyint', { name: 'subscriber', width: 1, default: () => "'0'" })
  subscriber: boolean;

  @Column('tinyint', { name: 'manager', width: 1, default: () => "'0'" })
  manager: boolean;

  @Column('varchar', { name: 'badges', nullable: true, length: 144 })
  badges: string | null;

  @Column('text', { name: 'text' })
  text: string;
}
