import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('streamId_index', ['streamId'], {})
@Entity('twitchStream', { schema: 'onadnode' })
export class TwitchStream {
  @PrimaryGeneratedColumn({ type: 'int', name: 'code' })
  code: number;

  @Column('varchar', { name: 'streamId', nullable: true, length: 50 })
  streamId: string | null;

  @Column('varchar', { name: 'streamerId', nullable: true, length: 50 })
  streamerId: string | null;

  @Column('varchar', { name: 'streamerName', nullable: true, length: 50 })
  streamerName: string | null;

  @Column('varchar', { name: 'startedAt', nullable: true, length: 50 })
  startedAt: string | null;
}
