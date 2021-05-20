import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('marketerInquiry', { schema: 'onadnode' })
export class MarketerInquiry {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', length: 50, default: () => "''" })
  name: string;

  @Column('varchar', { name: 'contactNumber', length: 50, default: () => "''" })
  contactNumber: string;

  @Column('varchar', { name: 'email', length: 50, default: () => "''" })
  email: string;

  @Column('varchar', { name: 'brandName', nullable: true, length: 50 })
  brandName: string | null;

  @Column('varchar', {
    name: 'homepage',
    nullable: true,
    length: 150,
    default: () => "''",
  })
  homepage: string | null;

  @Column('text', { name: 'inquiryContents' })
  inquiryContents: string;

  @Column('int', { name: 'privacyAgreement', default: () => "'0'" })
  privacyAgreement: number;

  @Column('timestamp', {
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('int', { name: 'reply', default: () => "'0'" })
  reply: number;
}
