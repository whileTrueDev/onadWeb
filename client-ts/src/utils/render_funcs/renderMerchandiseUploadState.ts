
export const MERCHANDISE_UPLOADED = 1; // 온애드몰 업로드된 경우
export const MERCHANDISE_SOLDOUT = 2; // 온애드몰 업로드 이후 완판 또는 모종의 이유로 온애드몰 목록에서 다시 내려간 경우

export default function renderMerchandiseUploadState(state: number): string {
  const lookupArray = ['준비중', '판매중', '판매완료'];
  return lookupArray[state];
}
