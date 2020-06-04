import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'adPickCampaign' })
export default class AdPickCampaign extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  apOffer!: string; // 캠페인 코드

  @Column()
  apType!: string; // 캠페인 종류 (1 : 앱설치형, 3 : 가입형, 4 : 이벤트형, 16 : 사전예약)

  @Column()
  apCategory!: string; // 캠페인 카테고리 (1 : 게임, 2 : 쇼핑, 3 : 교육, 4 : 생활, 5 : 웹툰)

  @Column({ nullable: true })
  apPackage?: string; // Android 캠페인 구글플레이 패키지명

  @Column({ nullable: true })
  apItemid?: string; // iOS 캠페인 앱스토어 아이템 아이디

  @Column({ nullable: true })
  apAppTitle?: string; // 앱명

  @Column({ nullable: true })
  apHeadline?: string; // 앱 한 줄 설명

  // 동영상 소재
  @Column()
  apVideo!: string;

  @Column()
  apDailyCap!: string; // 데일리 캡 (0 : 제한없음)

  @Column()
  apRemain!: number; // 오늘 남은 수

  @Column({ nullable: true })
  apOS?: 'Android' | 'iOS' | 'Both'; // 캠페인 OS (Both : Android, iOS 모두 가능)

  // 홍보문구
  @Column({ nullable: true })
  apAppPromoText?: string;

  @Column({ nullable: true })
  apKPI?: string; // 미정산 조건

  @Column({ nullable: true })
  apPartner?: string; // 지정 파트너 캠페인

  @Column({ type: 'json', nullable: true })
  apImages?: { // 사이즈별 홍보이미지
    icon?: string; icon57?: string; icon114?: string; icon256?: string;
    banner640x100?: string; banner640x960?: string;
    banner960x640?: string; banner640x640?: string;
    banner1024x500?: string;
  };

  @Column()
  apTrackingLink!: string; // 캠페인 트랙킹(클릭) 링크

  @Column()
  apHook!: 'false' | 'true'; // TUNE, Appsflyer 트래커를 사용하는 앱

  @Column()
  apEvent!: 'true' | 'false'; // 리텐션 추적이 가능한 캠페인

  @Column()
  apPayout!: number; // payout

  @Column({ nullable: true })
  apIOSPayout?: number;// iOS 캠페인의 payout (both, ios 캠페인의 경우에만)

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
