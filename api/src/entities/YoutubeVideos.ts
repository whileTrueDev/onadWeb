import { Column, Entity } from 'typeorm';

@Entity('youtubeVideos', { schema: 'onadnode' })
export class YoutubeVideos {
  @Column('varchar', { primary: true, name: 'videoId', length: 50 })
  videoId: string;

  @Column('varchar', { name: 'videoTItle', nullable: true, length: 255 })
  videoTItle: string | null;

  @Column('varchar', { name: 'channelId', nullable: true, length: 50 })
  channelId: string | null;

  @Column('varchar', { name: 'channelName', nullable: true, length: 50 })
  channelName: string | null;

  @Column('timestamp', {
    name: 'startDate',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  startDate: Date | null;
}
