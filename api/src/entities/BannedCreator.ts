import { Column, Entity } from 'typeorm';

@Entity('bannedCreator', { schema: 'onadnode' })
export class BannedCreator {
  @Column('varchar', { primary: true, name: 'creatorId', length: 50 })
  creatorId: string;

  @Column('timestamp', { name: 'time', default: () => 'CURRENT_TIMESTAMP' })
  time: Date;
}
