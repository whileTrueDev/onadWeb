import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';

@Entity('creatorInfo', { schema: 'onadnode' })
export class CreatorInfo {
  @Column('varchar', { primary: true, name: 'creatorId', length: 50 })
  creatorId: string;

  @Column('varchar', {
    name: 'creatorName',
    nullable: true,
    length: 50,
    default: () => "''",
  })
  creatorName: string | null;

  @Column('varchar', { name: 'creatorIp', nullable: true, length: 50 })
  creatorIp: string | null;

  @Column('varchar', {
    name: 'creatorMail',
    nullable: true,
    length: 50,
    default: () => "''",
  })
  creatorMail: string | null;

  @Column('varchar', {
    name: 'realName',
    nullable: true,
    length: 50,
    default: () => "''",
  })
  realName: string | null;

  @Column('varchar', {
    name: 'creatorAccountNumber',
    nullable: true,
    length: 100,
  })
  creatorAccountNumber: string | null;

  @Column('varchar', { name: 'advertiseUrl', nullable: true, length: 50 })
  advertiseUrl: string | null;

  @Column('int', { name: 'creatorAlarmAgreement', default: () => "'0'" })
  creatorAlarmAgreement: number;

  @Column('int', { name: 'creatorContractionAgreement', default: () => "'0'" })
  creatorContractionAgreement: number;

  @Column('timestamp', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('varchar', { name: 'creatorTwitchId', nullable: true, length: 50 })
  creatorTwitchId: string | null;

  @Column('varchar', { name: 'creatorLogo', nullable: true, length: 200 })
  creatorLogo: string | null;

  @Column('int', { name: 'arrested', nullable: true, default: () => "'0'" })
  arrested: number | null;

  @Column('int', {
    name: 'noticeReadState',
    nullable: true,
    default: () => "'0'",
  })
  noticeReadState: number | null;

  @Column('int', { name: 'adChatAgreement', default: () => "'0'" })
  adChatAgreement: number;

  @Column('int', {
    name: 'settlementState',
    nullable: true,
    default: () => "'0'",
  })
  settlementState: number | null;

  @Column('varchar', {
    name: 'identificationNumber',
    nullable: true,
    length: 50,
  })
  identificationNumber: string | null;

  @Column('varchar', { name: 'name', nullable: true, length: 50 })
  name: string | null;

  @Column('varchar', { name: 'phoneNumber', nullable: true, length: 50 })
  phoneNumber: string | null;

  @Column('int', { name: 'creatorType', default: () => "'0'" })
  creatorType: number;

  @Exclude()
  @Column('longtext', { name: 'identificationImg', nullable: true })
  identificationImg: string | null;

  @Column('longtext', { name: 'AccountImg', nullable: true })
  accountImg: string | null;

  @Column('longtext', { name: 'BussinessRegiImg', nullable: true })
  bussinessRegiImg: string | null;

  @Column('int', { name: 'CPAAgreement', default: () => "'0'" })
  cpaAgreement: number;

  @Column('varchar', {
    name: 'remoteControllerUrl',
    nullable: true,
    length: 50,
  })
  remoteControllerUrl: string | null;

  @Column('varchar', { name: 'loginId', nullable: true, length: 50 })
  loginId: string | null;

  @Exclude()
  @Column('varchar', { name: 'password', nullable: true, length: 150 })
  password: string | null;

  @Exclude()
  @Column('varchar', { name: 'passwordSalt', nullable: true, length: 150 })
  passwordSalt: string | null;

  @Column('varchar', {
    name: 'creatorTwitchOriginalId',
    nullable: true,
    length: 50,
  })
  creatorTwitchOriginalId: string | null;

  @Column('varchar', {
    name: 'creatorTwitchRefreshToken',
    nullable: true,
    length: 200,
  })
  creatorTwitchRefreshToken: string | null;

  @Column('varchar', { name: 'afreecaId', nullable: true, length: 50 })
  afreecaId: string | null;

  @Column('varchar', { name: 'afreecaName', nullable: true, length: 50 })
  afreecaName: string | null;

  @Column('varchar', {
    name: 'afreecaRefreshToken',
    nullable: true,
    length: 200,
  })
  afreecaRefreshToken: string | null;

  @Column('varchar', { name: 'afreecaLogo', nullable: true, length: 200 })
  afreecaLogo: string | null;

  constructor(partial: Partial<CreatorInfo>) {
    Object.assign(this, partial);
  }
}
