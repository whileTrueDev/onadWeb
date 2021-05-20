import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('merchandiseOrderStatuses', { schema: 'onadnode' })
export class MerchandiseOrderStatuses {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '의미없는 프라이머리키',
    unsigned: true,
  })
  id: number;

  @Column('int', { name: 'statusNumber', comment: '주문 상태 번호' })
  statusNumber: number;

  @Column('varchar', {
    name: 'statusString',
    nullable: true,
    comment: '주문 상태 이름',
    length: 50,
  })
  statusString: string | null;
}
