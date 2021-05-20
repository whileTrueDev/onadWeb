import { Column, Entity } from 'typeorm';

@Entity('AfreecaCategory', { schema: 'onadnode' })
export class AfreecaCategory {
  @Column('varchar', { primary: true, name: 'categoryId', length: 255 })
  categoryId: string;

  @Column('varchar', {
    name: 'categoryNameKr',
    comment: '카테고리 한글 이름',
    length: 255,
  })
  categoryNameKr: string;

  @Column('tinyint', {
    name: 'isSub',
    comment: '하위 카테고리 여부, 1=하위카테고리, 0=아님',
  })
  isSub: number;

  @Column('varchar', {
    name: 'parentCategoryId',
    nullable: true,
    comment: '상위 카테고리 Id',
    length: 255,
  })
  parentCategoryId: string | null;
}
