import { Column, Entity } from 'typeorm';

@Entity('kakaoAlimtalk', { schema: 'onadnode' })
export class KakaoAlimtalk {
  @Column('varchar', {
    primary: true,
    name: 'messages_messageId',
    length: 100,
    default: () => "''",
  })
  messagesMessageId: string;

  @Column('varchar', { name: 'requestId', nullable: true, length: 100 })
  requestId: string | null;

  @Column('varchar', { name: 'requestTime', nullable: true, length: 50 })
  requestTime: string | null;

  @Column('varchar', { name: 'statusCode', nullable: true, length: 100 })
  statusCode: string | null;

  @Column('varchar', { name: 'statusName', nullable: true, length: 50 })
  statusName: string | null;

  @Column('varchar', {
    name: 'messages_countryCode',
    nullable: true,
    length: 50,
  })
  messagesCountryCode: string | null;

  @Column('varchar', { name: 'messages_to', nullable: true, length: 50 })
  messagesTo: string | null;

  @Column('varchar', { name: 'messages_content', nullable: true, length: 200 })
  messagesContent: string | null;

  @Column('varchar', {
    name: 'messages_requestStatusCode',
    nullable: true,
    length: 50,
  })
  messagesRequestStatusCode: string | null;

  @Column('varchar', {
    name: 'messages_requestStatusName',
    nullable: true,
    length: 100,
  })
  messagesRequestStatusName: string | null;

  @Column('varchar', {
    name: 'messages_requestStatusDesc',
    nullable: true,
    length: 100,
  })
  messagesRequestStatusDesc: string | null;
}
