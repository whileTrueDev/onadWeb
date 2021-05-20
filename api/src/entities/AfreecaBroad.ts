import { Column, Entity, Index } from 'typeorm';

@Index('userId_index', ['userId'], {})
@Index('userNick_index', ['userNick'], {})
@Index('createdAt_index', ['createdAt'], {})
@Entity('AfreecaBroad', { schema: 'onadnode' })
export class AfreecaBroad {
  @Column('varchar', { primary: true, name: 'broadId', length: 255 })
  broadId: string;

  @Column('varchar', {
    name: 'firstTitle',
    comment: '방송 시작시 제목',
    length: 255,
    default: () => "''",
  })
  firstTitle: string;

  @Column('timestamp', {
    name: 'broadStartedAt',
    comment: '방송 시작 시간',
    default: () => 'CURRENT_TIMESTAMP',
  })
  broadStartedAt: Date;

  @Column('varchar', {
    name: 'userId',
    comment: '아프리카 BJ 로그인 아이디',
    length: 255,
  })
  userId: string;

  @Column('varchar', {
    name: 'userNick',
    comment: '아프리카 BJ 닉네임',
    length: 255,
  })
  userNick: string;

  @Column('timestamp', {
    name: 'createdAt',
    default: () => "'current_timestamp(6)'",
  })
  createdAt: Date;
}
