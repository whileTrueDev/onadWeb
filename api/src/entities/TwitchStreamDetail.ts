import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('streamId_index', ['streamId'], {})
@Index('gameId_index', ['gameId'], {})
@Index('time_index', ['time'], {})
@Entity('twitchStreamDetail', { schema: 'onadnode' })
export class TwitchStreamDetail {
  @PrimaryGeneratedColumn({ type: 'int', name: 'code' })
  code: number;

  @Column('varchar', { name: 'streamId', nullable: true, length: 50 })
  streamId: string | null;

  @Column('varchar', { name: 'streamerName', nullable: true, length: 50 })
  streamerName: string | null;

  @Column('int', { name: 'viewer', nullable: true })
  viewer: number | null;

  @Column('varchar', { name: 'title', nullable: true, length: 150 })
  title: string | null;

  @Column('varchar', { name: 'gameId', nullable: true, length: 50 })
  gameId: string | null;

  @Column('text', { name: 'tagIds', nullable: true })
  tagIds: string | null;

  @Column('timestamp', { name: 'time', nullable: true })
  time: Date | null;
}
