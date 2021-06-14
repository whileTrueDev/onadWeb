import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('video_id', ['videoId'], {})
@Entity('youtubeChat', { schema: 'onadnode' })
export class YoutubeChat {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'videoId', nullable: true, length: 50 })
  videoId: string | null;

  @Column('varchar', { name: 'authorId', nullable: true, length: 50 })
  authorId: string | null;

  @Column('timestamp', { name: 'time', nullable: true })
  time: Date | null;

  @Column('varchar', { name: 'playTime', nullable: true, length: 25 })
  playTime: string | null;

  @Column('text', { name: 'text', nullable: true })
  text: string | null;
}
