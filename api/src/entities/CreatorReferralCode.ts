import { Column, Entity } from 'typeorm';

@Entity('creatorReferralCode', { schema: 'onadnode' })
export class CreatorReferralCode {
  @Column('varchar', {
    primary: true,
    name: 'creatorId',
    comment: '방송인 고유 아이디',
    length: 50,
    default: () => "''",
  })
  creatorId: string;

  @Column('varchar', {
    name: 'referralCode',
    nullable: true,
    comment: '추천인 코드',
    length: 50,
    default: () => "''",
  })
  referralCode: string | null;

  @Column('timestamp', {
    name: 'createdAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;
}
