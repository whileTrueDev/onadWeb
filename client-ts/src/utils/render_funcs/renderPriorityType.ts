export default function renderPriorityType(type: number): string {
  if (type === 99) {
    return '온애드 기본 배너';
  }
  const priorityTypeList = ['크리에이터 우선', '카테고리 우선', '노출 우선'];
  return priorityTypeList[type];
}
