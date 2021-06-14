import { Column, Entity } from 'typeorm';

@Entity('sleepMarketer', { schema: 'onadnode' })
export class SleepMarketer {
  @Column('varchar', { primary: true, name: 'marketerId', length: 50 })
  marketerId: string;

  @Column('varchar', { name: 'marketerPasswd', length: 100 })
  marketerPasswd: string;

  @Column('varchar', { name: 'marketerSalt', length: 100 })
  marketerSalt: string;

  @Column('varchar', { name: 'marketerName', length: 50 })
  marketerName: string;

  @Column('varchar', { name: 'marketerMail', length: 50 })
  marketerMail: string;

  @Column('varchar', { name: 'marketerPhoneNum', length: 50 })
  marketerPhoneNum: string;

  @Column('varchar', {
    name: 'marketerBusinessRegNum',
    nullable: true,
    length: 50,
  })
  marketerBusinessRegNum: string | null;

  @Column('longtext', { name: 'marketerBusinessRegSrc', nullable: true })
  marketerBusinessRegSrc: string | null;

  @Column('int', { name: 'marketerUserType', default: () => "'0'" })
  marketerUserType: number;

  @Column('int', { name: 'marketerContraction', default: () => "'0'" })
  marketerContraction: number;

  @Column('int', { name: 'marketerAlarmAgreement', default: () => "'1'" })
  marketerAlarmAgreement: number;

  @Column('int', { name: 'marketerEmailAuth', default: () => "'0'" })
  marketerEmailAuth: number;

  @Column('timestamp', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('int', { name: 'temporaryLogin', default: () => "'0'" })
  temporaryLogin: number;

  @Column('varchar', {
    name: 'marketerAccountNumber',
    nullable: true,
    length: 50,
  })
  marketerAccountNumber: string | null;

  @Column('varchar', { name: 'accountHolder', length: 50 })
  accountHolder: string;

  @Column('timestamp', {
    name: 'movedDate',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  movedDate: Date | null;
}
