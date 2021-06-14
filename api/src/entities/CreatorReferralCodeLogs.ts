import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('creatorReferralCodeLogs', { schema: 'onadnode' })
export class CreatorReferralCodeLogs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', {
    name: 'creatorId',
    nullable: true,
    comment: '가입 방송인 고유 아이디',
    length: 50,
  })
  creatorId: string | null;

  @Column('varchar', {
    name: 'referralCode',
    nullable: true,
    comment: '가입시 입력한 추천인 (방송인) 아이디',
    length: 100,
  })
  referralCode: string | null;

  @Column('int', {
    name: 'calculateState',
    nullable: true,
    comment: '계산 여부 0=가입완료, 1=연동완료, 2=계산->지급완료',
  })
  calculateState: number | null;

  @Column('timestamp', {
    name: 'createdAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp', {
    name: 'calculatedAt',
    nullable: true,
    comment: '계산 반영 날짜',
  })
  calculatedAt: Date | null;
}
