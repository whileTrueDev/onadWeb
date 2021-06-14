import { Column, Entity } from 'typeorm';

@Entity('youtubeCreators', { schema: 'onadnode' })
export class YoutubeCreators {
  @Column('varchar', { primary: true, name: 'channelId', length: 50 })
  channelId: string;
}
