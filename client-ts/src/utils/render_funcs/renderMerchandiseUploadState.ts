
export const MERCHANDISE_UPLOAD_WAITING = null; // 온애드샵 업로드 대기중 상태
export const MERCHANDISE_UPLOAD_DENYED = 0; // 온애드샵 업로드 거절된 경우
export const MERCHANDISE_UPLOAD_UPLOADED = 1; // 온애드샵 업로드된 경우
export const MERCHANDISE_UPLOAD_SOLDOUT = 2; // 온애드샵 업로드 이후 완판 또는 모종의 이유로 온애드샵 목록에서 다시 내려간 경우

export default function renderMerchandiseUploadState(state: number | null): string {
  const lookupArray = ['판매거절됨', '판매중', '판매완료'];
  if (state === null) return '준비중';
  return lookupArray[state];
}
