export interface CampaignResult extends AdPickCampaign {
  campaignState?: number; campaignIncome?: string;
}

export interface AdPickIncome {
  apOffer: string; apType: string; apAppTitle: string;
  apImages?: AdPickImages;
  campaignId: string; campaignIncome: number; conversionCount: number;
  campaignState?: number;
}

// adpick 응답 데이터 설명
export interface AdPickCampaign {
  id: number;
  apOffer: string; // 캠페인 코드
  apType: string; // 캠페인 종류 (1 : 앱설치형, 3 : 가입형, 4 : 이벤트형, 16 : 사전예약)
  apCategory: string; // 캠페인 카테고리 (1 : 게임, 2 : 쇼핑, 3 : 교육, 4 : 생활, 5 : 웹툰)
  apPackage?: string; // Android 캠페인 구글플레이 패키지명
  apItemid?: string; // iOS 캠페인 앱스토어 아이템 아이디
  apAppTitle?: string; // 앱명
  apHeadline?: string; // 앱 한 줄 설명
  // 동영상 소재
  apVideo: string;
  apDailyCap: string | number; // 데일리 캡 (0 : 제한없음)
  apRemain: number; // 오늘 남은 수
  apOS?: 'Android' | 'iOS' | 'Both'; // 캠페인 OS (Both : Android, iOS 모두 가능)
  // 홍보문구
  apAppPromoText?: string;
  apKPI?: string; // 미정산 조건
  apPartner?: string; // 지정 파트너 캠페인
  apImages?: AdPickImages; // 사이즈별 홍보이미지;
  apTrackingLink: string; // 캠페인 트랙킹(클릭) 링크
  apHook: string; // TUNE, Appsflyer 트래커를 사용하는 앱
  apEvent: string; // 리텐션 추적이 가능한 캠페인
  apPayout: number | string; // payout
  apIOSPayout?: number | string;// iOS 캠페인의 payout (both, ios 캠페인의 경우에만)
}

interface AdPickImages {
  icon?: string; icon57?: string; icon114?: string; icon256?: string;
  banner640x100?: string; banner640x960?: string;
  banner960x640?: string; banner640x640?: string;
  banner1024x500?: string;
}
export enum AdpickCampaignStateEnum {
  ACTIVE = 1, INACTIVE = 2
}
export enum AdpickCampaignTypeEnum {
  INSTALL = '1', SIGNUP = '3', EVENT = '4', RESERVATION = '16'
}
