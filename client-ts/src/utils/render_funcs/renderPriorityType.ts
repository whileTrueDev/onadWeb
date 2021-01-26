export default function renderPriorityType(type: number): string {
  const priorityTypeList = ['크리에이터 우선', '카테고리 우선', '노출 우선'];
  return priorityTypeList[type];
}
