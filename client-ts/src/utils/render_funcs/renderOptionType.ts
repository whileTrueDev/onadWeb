export default function renderOptionType(type: number): string {
  const optionTypeList = ['(구)배너 광고', '생방송 배너 광고', '(구)클릭 광고'];
  return optionTypeList[type];
}
