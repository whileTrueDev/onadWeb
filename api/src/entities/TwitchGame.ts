import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('gameId_index', ['gameId'], {})
@Entity('twitchGame', { schema: 'onadnode' })
export class TwitchGame {
  @PrimaryGeneratedColumn({ type: 'int', name: 'code' })
  code: number;

  @Column('varchar', { name: 'gameId', nullable: true, length: 50 })
  gameId: string | null;

  @Column('varchar', { name: 'gameName', nullable: true, length: 100 })
  gameName: string | null;

  @Column('varchar', { name: 'gameNameKr', nullable: true, length: 100 })
  gameNameKr: string | null;

  @Column('varchar', { name: 'boxArt', nullable: true, length: 200 })
  boxArt: string | null;

  @Column('timestamp', { name: 'date', nullable: true })
  date: Date | null;
}
