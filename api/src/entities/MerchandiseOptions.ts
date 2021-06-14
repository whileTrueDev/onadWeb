import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('merchandiseOptions', { schema: 'onadnode' })
export class MerchandiseOptions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', {
    name: 'merchandiseId',
    nullable: true,
    comment: '상품 고유 아이디 (merchandiseRegistered)',
  })
  merchandiseId: number | null;

  @Column('varchar', {
    name: 'type',
    nullable: true,
    comment: '옵션타입(ex.색상)',
    length: 100,
  })
  type: string | null;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    comment: '옵션명(ex.블루,화이트)',
    length: 100,
  })
  name: string | null;

  @Column('int', {
    name: 'additionalPrice',
    nullable: true,
    comment: '옵션추가금액',
  })
  additionalPrice: number | null;

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
