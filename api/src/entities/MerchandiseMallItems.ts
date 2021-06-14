import {
  Column, Entity, Index, PrimaryGeneratedColumn
} from 'typeorm';

@Index('merchandiseId_unique', ['merchandiseId'], { unique: true })
@Entity('merchandiseMallItems', { schema: 'onadnode' })
export class MerchandiseMallItems {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', {
    name: 'merchandiseId',
    nullable: true,
    unique: true,
    comment: '온애드몰에 업로드된 상품 ID',
    length: 100,
  })
  merchandiseId: string | null;

  @Column('tinyint', {
    name: 'uploadState',
    nullable: true,
    comment: '온애드몰 업로드상태(0=거절, 1=등록됨, 2=업로드이후제거됨)',
    unsigned: true,
  })
  uploadState: number | null;

  @Column('text', {
    name: 'itemSiteUrl',
    nullable: true,
    comment: '온애드몰 상품 URL',
  })
  itemSiteUrl: string | null;

  @Column('int', {
    name: 'soldCount',
    nullable: true,
    comment: '온애드몰로부터 팔린 상품 수',
    unsigned: true,
  })
  soldCount: number | null;

  @Column('varchar', {
    name: 'denialReason',
    nullable: true,
    comment: '상품거절사유(거절시에만 존재)',
    length: 50,
  })
  denialReason: string | null;
}
