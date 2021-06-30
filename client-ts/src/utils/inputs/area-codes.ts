// domain select용.
const areaCodes = [
  { value: '02' },
  { value: '051' },
  { value: '053' },
  { value: '032' },
  { value: '062' },
  { value: '042' },
  { value: '052' },
  { value: '044' },
  { value: '031' },
  { value: '033' },
  { value: '043' },
  { value: '041' },
  { value: '063' },
  { value: '061' },
  { value: '054' },
  { value: '055' },
  { value: '064' },
];

export const MenuProps = {
  PaperProps: {
    style: {
      // 기본 높이 * 갯수 + 여백, 반응형 테스트 완료
      maxHeight: 48 * 4.5 + 10,
      width: 100,
    },
  },
};

export default areaCodes;
