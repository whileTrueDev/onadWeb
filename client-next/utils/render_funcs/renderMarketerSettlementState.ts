export const 광고주_정산등록상태_승인대기 = 0;
export const 광고주_정산등록상태_승인 = 1;
export const 광고주_정산등록상태_반려 = 2;

// 정산등록상태 (0=승인대기, 1=승인완료, 2=반려)
export default function renderMarketerSettlementState(state: number): string {
  const d = ['승인 대기', '승인 완료', '반려'];

  return d[state];
}
