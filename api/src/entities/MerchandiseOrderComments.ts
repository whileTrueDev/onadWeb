import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MerchandiseOrders } from './MerchandiseOrders';

@Index('orderComments', ['orderId'], {})
@Entity('merchandiseOrderComments', { schema: 'onadnode' })
export class MerchandiseOrderComments {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', {
    name: 'orderId',
    comment: '주문 고유 아이디',
    unsigned: true,
  })
  orderId: number;

  @Column('varchar', {
    name: 'authorName',
    nullable: true,
    comment: '작성자닉네임',
    length: 100,
  })
  authorName: string | null;

  @Column('varchar', {
    name: 'authorId',
    nullable: true,
    comment: '작성자아이디',
    length: 100,
  })
  authorId: string | null;

  @Column('varchar', {
    name: 'targetCreatorName',
    nullable: true,
    comment: '응원방송인닉네임',
    length: 100,
  })
  targetCreatorName: string | null;

  @Column('varchar', {
    name: 'title',
    comment: '제목',
    length: 255,
    default: () => "''",
  })
  title: string;

  @Column('varchar', {
    name: 'contents',
    comment: '내용',
    length: 500,
    default: () => "''",
  })
  contents: string;

  @Column('varchar', {
    name: 'creatorId',
    nullable: true,
    comment: '방송인고유아이디(온애드)',
    length: 100,
  })
  creatorId: string | null;

  @Column('timestamp', {
    name: 'createDate',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date | null;

  @Column('timestamp', {
    name: 'updateDate',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateDate: Date | null;

  @ManyToOne(
    () => MerchandiseOrders,
    (merchandiseOrders) => merchandiseOrders.merchandiseOrderComments,
    { onDelete: 'CASCADE', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ name: 'orderId', referencedColumnName: 'id' }])
  order: MerchandiseOrders;
}
