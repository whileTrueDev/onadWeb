import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MerchandiseOrderComments } from './MerchandiseOrderComments';
import { MerchandiseOrderRelease } from './MerchandiseOrderRelease';

@Entity('merchandiseOrders', { schema: 'onadnode' })
export class MerchandiseOrders {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', {
    name: 'campaignId',
    nullable: true,
    comment: '주문상품의 캠페인ID',
    length: 100,
  })
  campaignId: string | null;

  @Column('int', { name: 'merchandiseId', comment: '주문상품ID' })
  merchandiseId: number;

  @Column('int', {
    name: 'optionId',
    nullable: true,
    comment: '주문시선택옵션ID (merchandiseOptions)',
  })
  optionId: number | null;

  @Column('int', {
    name: 'status',
    comment:
      '주문상태(0=주문접수,1=상품준비중,2=출고준비, 3=출고완료,4=배송완료, 5=주문취소, 6=구매확정)',
    default: () => "'0'",
  })
  status: number;

  @Column('int', { name: 'quantity', comment: '주문 수량' })
  quantity: number;

  @Column('int', { name: 'orderPrice', comment: '주문 금액' })
  orderPrice: number;

  @Column('varchar', {
    name: 'ordererName',
    comment: '주문자 이름',
    length: 50,
    default: () => "''",
  })
  ordererName: string;

  @Column('varchar', {
    name: 'recipientName',
    comment: '받는분 이름',
    length: 50,
    default: () => "''",
  })
  recipientName: string;

  @Column('tinyint', {
    name: 'calculateDoneFlag',
    comment: '계산 완료 여부(0=미완,1=완료)',
    width: 1,
    default: () => "'0'",
  })
  calculateDoneFlag: boolean;

  @Column('varchar', { name: 'deliveryMemo', comment: '배송메모', length: 100 })
  deliveryMemo: string;

  @Column('int', {
    name: 'deliveryFee',
    nullable: true,
    comment: '배송비',
    default: () => "'3000'",
  })
  deliveryFee: number | null;

  @Column('varchar', {
    name: 'denialReason',
    nullable: true,
    comment: '주문취소사유',
    length: 100,
  })
  denialReason: string | null;

  @Column('varchar', { name: 'email', comment: '주문자 이메일', length: 100 })
  email: string;

  @Column('varchar', {
    name: 'jibunAddress',
    comment: '받는 분 지번주소',
    length: 255,
  })
  jibunAddress: string;

  @Column('varchar', {
    name: 'roadAddress',
    comment: '받는 분 도로명 주소',
    length: 255,
  })
  roadAddress: string;

  @Column('varchar', { name: 'phone', comment: '받는분 전화번호', length: 100 })
  phone: string;

  @Column('varchar', {
    name: 'zoneCode',
    comment: '받는분 우편번호',
    length: 100,
  })
  zoneCode: string;

  @Column('timestamp', {
    name: 'createDate',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date;

  @Column('timestamp', {
    name: 'updateDate',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateDate: Date;

  @OneToMany(
    () => MerchandiseOrderComments,
    merchandiseOrderComments => merchandiseOrderComments.order,
  )
  merchandiseOrderComments: MerchandiseOrderComments[];

  @OneToMany(
    () => MerchandiseOrderRelease,
    merchandiseOrderRelease => merchandiseOrderRelease.order,
  )
  merchandiseOrderReleases: MerchandiseOrderRelease[];
}
