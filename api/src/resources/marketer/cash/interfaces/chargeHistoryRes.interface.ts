export interface ChargeHistoryResObj {
  cash: string;
  date: Date;
  type: '가상계좌' | '계좌이체' | '신용카드' | string;
  temporaryState: '완료됨' | '취소됨' | '진행중';
}
