import { Column, Entity } from 'typeorm';

@Entity('marketerInfo', { schema: 'onadnode' })
export class MarketerInfo {
  @Column('varchar', { primary: true, name: 'marketerId', length: 100 })
  marketerId: string;

  @Column('int', {
    name: 'platformType',
    nullable: true,
    default: () => "'0'",
    comment: '0: 우리플랫폼, 1: 구글, 2: 네이버, 3: 카카오',
  })
  platformType: number | null;

  @Column('varchar', { name: 'marketerName', nullable: true, length: 50 })
  marketerName: string | null;

  @Column('varchar', { name: 'marketerMail', nullable: true, length: 50 })
  marketerMail: string | null;

  @Column('varchar', { name: 'marketerPhoneNum', nullable: true, length: 50 })
  marketerPhoneNum: string | null;

  @Column('varchar', {
    name: 'marketerBusinessRegNum',
    nullable: true,
    length: 50,
  })
  marketerBusinessRegNum: string | null;

  @Column('longtext', { name: 'marketerBusinessRegSrc', nullable: true })
  marketerBusinessRegSrc: string | null;

  @Column('int', {
    name: 'marketerUserType',
    nullable: true,
    default: () => "'0'",
  })
  marketerUserType: number | null;

  @Column('int', {
    name: 'marketerContraction',
    nullable: true,
    default: () => "'0'",
  })
  marketerContraction: number | null;

  @Column('int', {
    name: 'marketerAlarmAgreement',
    nullable: true,
    default: () => "'1'",
  })
  marketerAlarmAgreement: number | null;

  @Column('int', {
    name: 'marketerEmailAuth',
    nullable: true,
    default: () => "'1'",
  })
  marketerEmailAuth: number | null;

  @Column('timestamp', {
    name: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date | null;

  @Column('int', {
    name: 'temporaryLogin',
    nullable: true,
    default: () => "'0'",
  })
  temporaryLogin: number | null;

  @Column('varchar', {
    name: 'marketerAccountNumber',
    nullable: true,
    length: 50,
  })
  marketerAccountNumber: string | null;

  @Column('varchar', { name: 'accountHolder', nullable: true, length: 50 })
  accountHolder: string | null;

  @Column('varchar', { name: 'marketerSalt', nullable: true, length: 100 })
  marketerSalt: string | null;

  @Column('varchar', { name: 'marketerPasswd', nullable: true, length: 100 })
  marketerPasswd: string | null;

  @Column('int', { name: 'signOutState', default: () => "'0'" })
  signOutState: number;

  @Column('timestamp', { name: 'signOutDate', nullable: true })
  signOutDate: Date | null;

  @Column('int', {
    name: 'noticeReadState',
    nullable: true,
    default: () => "'0'",
  })
  noticeReadState: number | null;

  @Column('longtext', {
    name: 'profileImage',
    nullable: true,
    comment: '프로필사진 base64문자열',
  })
  profileImage: string | null;
}
