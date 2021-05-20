import {
  Column, Entity, Index, PrimaryGeneratedColumn
} from 'typeorm';

@Index('merchandiseRegistered_marketerId_IDX', ['marketerId'], {})
@Entity('merchandiseRegistered', { schema: 'onadnode' })
export class MerchandiseRegistered {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', {
    name: 'marketerId',
    nullable: true,
    comment: '마케터고유아이디(온애드)',
    length: 50,
  })
  marketerId: string | null;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    comment: '상품명',
    length: 150,
  })
  name: string | null;

  @Column('int', {
    name: 'regularPrice',
    nullable: true,
    comment: '정가 (할인 미적용 가격)',
  })
  regularPrice: number | null;

  @Column('int', { name: 'price', nullable: true, comment: '판매가' })
  price: number | null;

  @Column('int', { name: 'stock', comment: '재고수량', default: () => "'0'" })
  stock: number;

  @Column('tinyint', {
    name: 'optionFlag',
    comment: '옵션여부(0=없음,1=있음) 옵션은 merchandiseOptions',
    width: 1,
    default: () => "'0'",
  })
  optionFlag: boolean;

  @Column('varchar', {
    name: 'description',
    nullable: true,
    comment: '상품상세설명',
    length: 1000,
    default: () => "''",
  })
  description: string | null;

  @Column('text', {
    name: 'images',
    nullable: true,
    comment: '상품사진(콤마(,)를 구분자로하는 이미지 URL주소)',
  })
  images: string | null;

  @Column('text', {
    name: 'descImages',
    nullable: true,
    comment: '상품상세설명사진(콤마(,)를 구분자로하는 이미지 URL주소)',
  })
  descImages: string | null;

  @Column('tinyint', {
    name: 'pickupFlag',
    comment: '픽업여부(0=안함,1=픽업요구)',
    width: 1,
    default: () => "'0'",
  })
  pickupFlag: boolean;

  @Column('varchar', {
    name: 'pickupId',
    nullable: true,
    comment: '상품픽업주소ID(merchandisePickupAdrresses)',
    length: 50,
  })
  pickupId: string | null;

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
}
