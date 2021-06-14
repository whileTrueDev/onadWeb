import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('merchandisePickupAddresses', { schema: 'onadnode' })
export class MerchandisePickupAddresses {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

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

  @Column('varchar', {
    name: 'roadAddress',
    nullable: true,
    comment: '도로명 주소',
    length: 255,
  })
  roadAddress: string | null;

  @Column('varchar', {
    name: 'roadAddressEnglish',
    nullable: true,
    comment: '도로명 영어 주소',
    length: 255,
  })
  roadAddressEnglish: string | null;

  @Column('varchar', {
    name: 'roadAddressDetail',
    nullable: true,
    comment: '주소 상세 설명 (아파트, 호 등등)',
    length: 255,
  })
  roadAddressDetail: string | null;

  @Column('varchar', {
    name: 'jibunAddress',
    nullable: true,
    comment: '지번 주소',
    length: 255,
  })
  jibunAddress: string | null;

  @Column('varchar', {
    name: 'jibunAddressEnglish',
    nullable: true,
    comment: '지번 영어 주소',
    length: 255,
  })
  jibunAddressEnglish: string | null;

  @Column('varchar', {
    name: 'buildingCode',
    nullable: true,
    comment: '건물 코드',
    length: 255,
  })
  buildingCode: string | null;

  @Column('varchar', {
    name: 'sido',
    nullable: true,
    comment: '시/도',
    length: 100,
  })
  sido: string | null;

  @Column('varchar', {
    name: 'sigungu',
    nullable: true,
    comment: '시군구이름',
    length: 100,
  })
  sigungu: string | null;

  @Column('varchar', {
    name: 'sigunguCode',
    nullable: true,
    comment: '시군구코드',
    length: 100,
  })
  sigunguCode: string | null;

  @Column('varchar', {
    name: 'bname',
    nullable: true,
    comment: '법정동이름',
    length: 100,
  })
  bname: string | null;

  @Column('varchar', {
    name: 'bCode',
    nullable: true,
    comment: '법정동코드',
    length: 100,
  })
  bCode: string | null;

  @Column('varchar', {
    name: 'roadname',
    nullable: true,
    comment: '도로명',
    length: 100,
  })
  roadname: string | null;

  @Column('varchar', {
    name: 'roadnameCode',
    nullable: true,
    comment: '도로명코드',
    length: 100,
  })
  roadnameCode: string | null;

  @Column('varchar', {
    name: 'zoneCode',
    nullable: true,
    comment: '우편번호',
    length: 50,
  })
  zoneCode: string | null;
}
