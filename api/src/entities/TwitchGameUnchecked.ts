import { Column, Entity } from 'typeorm';

@Entity('twitchGame_unchecked', { schema: 'onadnode' })
export class TwitchGameUnchecked {
  @Column('varchar', { primary: true, name: 'gameId', length: 50 })
  gameId: string;

  @Column('varchar', { primary: true, name: 'creatorId', length: 50 })
  creatorId: string;

  @Column('timestamp', {
    name: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date | null;
}
