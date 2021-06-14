import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MerchandiseOrders } from './MerchandiseOrders';

@Index('orderRelease', ['orderId'], {})
@Entity('merchandiseOrderRelease', { schema: 'onadnode' })
export class MerchandiseOrderRelease {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', {
    name: 'orderId',
    nullable: true,
    comment: '연결된 주문 아이디',
    unsigned: true,
  })
  orderId: number | null;

  @Column('varchar', {
    name: 'courierCompany',
    nullable: true,
    comment: '택배사',
    length: 50,
  })
  courierCompany: string | null;

  @Column('varchar', {
    name: 'trackingNumber',
    nullable: true,
    comment: '운송장번호',
    length: 255,
  })
  trackingNumber: string | null;

  @ManyToOne(
    () => MerchandiseOrders,
    merchandiseOrders => merchandiseOrders.merchandiseOrderReleases,
    { onDelete: 'RESTRICT', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'orderId', referencedColumnName: 'id' }])
  order: MerchandiseOrders;
}
