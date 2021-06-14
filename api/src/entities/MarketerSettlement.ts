import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('unique_marketerId', ['marketerId'], { unique: true })
@Entity('marketerSettlement', { schema: 'onadnode' })
export class MarketerSettlement {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', {
    name: 'marketerId',
    nullable: true,
    unique: true,
    comment: '마케터 고유 ID',
    length: 150,
  })
  marketerId: string | null;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    comment: '이름 (사업자인 경우 회사명)',
    length: 20,
  })
  name: string | null;

  @Column('varchar', {
    name: 'identificationNumber',
    nullable: true,
    comment: '주민등록번호 (사업자인 경우 사업자등록번호)',
    length: 50,
  })
  identificationNumber: string | null;

  @Column('varchar', {
    name: 'bankAccountOwner',
    nullable: true,
    comment: '예금주명',
    length: 50,
  })
  bankAccountOwner: string | null;

  @Column('varchar', {
    name: 'bankAccountNumber',
    nullable: true,
    comment: '계좌번호',
    length: 50,
  })
  bankAccountNumber: string | null;

  @Column('tinyint', {
    name: 'state',
    nullable: true,
    comment: '정산등록상태 (0=승인대기, 1=승인완료, 2=반려)',
    width: 1,
    default: () => "'0'",
  })
  state: boolean | null;

  @Column('tinyint', {
    name: 'businessmanFlag',
    comment: '사업자여부 0=일반인, 1=사업자',
    width: 1,
    default: () => "'0'",
  })
  businessmanFlag: boolean;

  @Column('longtext', {
    name: 'identificationImgSrc',
    nullable: true,
    comment: '신분증이미지 (사업자인 경우 사업자등록증이미지)',
  })
  identificationImgSrc: string | null;

  @Column('longtext', {
    name: 'bankAccountImgSrc',
    nullable: true,
    comment: '계좌 통장 사본 이미지',
  })
  bankAccountImgSrc: string | null;

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
