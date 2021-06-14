import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('publicNotice', { schema: 'onadnode' })
export class PublicNotice {
  @PrimaryGeneratedColumn({ type: 'int', name: 'code', unsigned: true })
  code: number;

  @Column('varchar', {
    name: 'target',
    nullable: true,
    comment: '타겟: 방송인/광고주/공통',
    length: 10,
  })
  target: string | null;

  @Column('varchar', { name: 'topic', length: 50, default: () => "'공지'" })
  topic: string;

  @Column('varchar', { name: 'title', length: 50, default: () => "'공지사항'" })
  title: string;

  @Column('mediumtext', { name: 'contents' })
  contents: string;

  @Column('timestamp', { name: 'regiDate', default: () => 'CURRENT_TIMESTAMP' })
  regiDate: Date;
}
