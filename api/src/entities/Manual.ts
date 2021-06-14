import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('manual', { schema: 'onadnode' })
export class Manual {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', {
    name: 'type',
    nullable: true,
    comment: '구분 - 크리에이터/마케터',
    length: 10,
  })
  type: string | null;

  @Column('int', {
    name: 'priority',
    nullable: true,
    comment: '순서. 우선순위로, 중복되는 경우 이름순',
  })
  priority: number | null;

  @Column('varchar', { name: 'title', nullable: true, length: 50 })
  title: string | null;

  @Column('varchar', { name: 'subTitle', nullable: true, length: 100 })
  subTitle: string | null;

  @Column('text', { name: 'contents', nullable: true })
  contents: string | null;

  @Column('timestamp', {
    name: 'createdAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp', {
    name: 'updatedAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;
}
