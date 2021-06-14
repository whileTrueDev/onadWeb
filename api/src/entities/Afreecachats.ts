import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('afreecachats', { schema: 'onadnode' })
export class Afreecachats {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'creatorId', nullable: true, length: 50 })
  creatorId: string | null;

  @Column('varchar', { name: 'userId', length: 50, default: () => "''" })
  userId: string;

  @Column('varchar', { name: 'chattime', nullable: true, length: 100 })
  chattime: string | null;

  @Column('varchar', { name: 'grade', length: 11, default: () => "''" })
  grade: string;

  @Column('varchar', { name: 'sex', length: 11 })
  sex: string;

  @Column('varchar', { name: 'is_mobile', length: 11, default: () => "''" })
  isMobile: string;

  @Column('text', { name: 'text' })
  text: string;

  @Column('varchar', { name: 'category', nullable: true, length: 100 })
  category: string | null;

  @Column('varchar', { name: 'videoTitle', nullable: true, length: 100 })
  videoTitle: string | null;

  @Column('varchar', { name: 'viewer', nullable: true, length: 100 })
  viewer: string | null;

  @Column('varchar', { name: 'like', nullable: true, length: 50 })
  like: string | null;

  @Column('varchar', { name: 'bookmark', nullable: true, length: 50 })
  bookmark: string | null;
}
