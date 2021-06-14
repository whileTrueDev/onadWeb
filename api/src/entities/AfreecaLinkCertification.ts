import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('tempCode', ['tempCode'], { unique: true })
@Entity('afreecaLinkCertification', { schema: 'onadnode' })
export class AfreecaLinkCertification {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'creatorId', nullable: true, length: 50 })
  creatorId: string | null;

  @Column('varchar', {
    name: 'tempCode',
    nullable: true,
    unique: true,
    length: 50,
  })
  tempCode: string | null;

  @Column('smallint', { name: 'certState', nullable: true, comment: '0=진행중,1=완료' })
  certState: number | null;

  @Column('varchar', { name: 'afreecaId', nullable: true, length: 50 })
  afreecaId: string | null;

  @Column('timestamp', {
    name: 'createdAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;
}
