import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('video', ['videoid'], {})
@Entity('youtubeOldChat', { schema: 'onadnode' })
export class YoutubeOldChat {
  @PrimaryGeneratedColumn({ type: 'int', name: 'code', unsigned: true })
  code: number;

  @Column('varchar', { name: 'username', nullable: true, length: 50 })
  username: string | null;

  @Column('varchar', { name: 'userid', nullable: true, length: 50 })
  userid: string | null;

  @Column('varchar', { name: 'membership', nullable: true, length: 50 })
  membership: string | null;

  @Column('varchar', { name: 'userphoto', nullable: true, length: 255 })
  userphoto: string | null;

  @Column('text', { name: 'text', nullable: true })
  text: string | null;

  @Column('varchar', { name: 'playtime', nullable: true, length: 50 })
  playtime: string | null;

  @Column('timestamp', { name: 'realtime', nullable: true })
  realtime: Date | null;

  @Column('varchar', { name: 'videoname', nullable: true, length: 50 })
  videoname: string | null;

  @Column('varchar', { name: 'videoid', nullable: true, length: 50 })
  videoid: string | null;

  @Column('varchar', { name: 'channelname', nullable: true, length: 50 })
  channelname: string | null;

  @Column('varchar', { name: 'channelid', nullable: true, length: 50 })
  channelid: string | null;
}
