import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('youtubeOldVideos', { schema: 'onadnode' })
export class YoutubeOldVideos {
  @PrimaryGeneratedColumn({ type: 'int', name: 'code' })
  code: number;

  @Column('varchar', { name: 'videoId', length: 50 })
  videoId: string;

  @Column('varchar', { name: 'channelId', nullable: true, length: 50 })
  channelId: string | null;
}
