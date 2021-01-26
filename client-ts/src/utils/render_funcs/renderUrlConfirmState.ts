export default function renderUrlConfirmState(type: number): string {
  const optionTypeList = [
    '승인대기',
    '승인됨',
    '거절됨',
  ];
  return optionTypeList[type];
}
