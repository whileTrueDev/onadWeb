export const CONFIRM_STATE_WAIT = 0;
export const CONFIRM_STATE_CONFIRMED = 1;
export const CONFIRM_STATE_REJECTED = 2;

export default function renderBannerConfirmState(type: number): string {
  const stateList = [
    '심의진행중',
    '승인됨',
    '거절됨',
  ];
  return stateList[type];
}
