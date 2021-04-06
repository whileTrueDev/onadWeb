export const LIVE_BANNER_OPTION_TYPE = 1;
export const CPS_OPTION_TYPE = 3;

export default function renderOptionType(type: number): string {
  const optionTypeList = ['(구)배너 광고', '생방송 배너 광고', '(구)클릭 광고', '상품 판매 성과형 광고'];
  return optionTypeList[type];
}
