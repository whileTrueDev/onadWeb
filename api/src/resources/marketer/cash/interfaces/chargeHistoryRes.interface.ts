export interface ChargeHistoryResObj {
  cash: string;
  date: string;
  type: '가상계좌' | '계좌이체' | '신용카드';
  temporaryState: '완료됨' | '취소됨' | '진행중';
}
