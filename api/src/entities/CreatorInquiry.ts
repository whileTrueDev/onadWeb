import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('creatorInquiry', { schema: 'onadnode' })
export class CreatorInquiry {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', length: 50, default: () => "''" })
  name: string;

  @Column('varchar', { name: 'email', length: 50, default: () => "''" })
  email: string;

  @Column('varchar', { name: 'usingPlatform', length: 50, default: () => "''" })
  usingPlatform: string;

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
