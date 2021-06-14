import { Column, Entity } from 'typeorm';

@Entity('youtubeLiveVideos', { schema: 'onadnode' })
export class YoutubeLiveVideos {
  @Column('varchar', {
    primary: true,
    name: 'videoId',
    length: 50,
    default: () => "''",
  })
  videoId: string;

  @Column('varchar', { name: 'activeLiveChatId', nullable: true, length: 255 })
  activeLiveChatId: string | null;

  @Column('varchar', { name: 'nextPageToken', nullable: true, length: 50 })
  nextPageToken: string | null;

  @Column('timestamp', {
    name: 'updateTime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date | null;

  @Column('timestamp', {
    name: 'startDate',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  startDate: Date | null;
}
