/**
 * 변환할 숫자와 소수점 단위수를 인자로 받아 1.4K, 1.5M 등과같이 숫자를 변환시켜주는 함수
 * @param num 변환 할 숫자
 * @param digits 소수점 단위 수 기본값 = 1
 * @example
 * numFormatter(1234) // 1.2K
 * numFormatter(1234, 2) // 1.23K
 * numFormatter(12345) // 12.3K
 */
function numFormatter(num: number, digits = 1): string {
  const si = [
    { value: 1, symbol: '' },
    { value: 1E3, symbol: 'k' },
    { value: 1E6, symbol: 'M' },
    { value: 1E9, symbol: 'G' },
    { value: 1E12, symbol: 'T' },
    { value: 1E15, symbol: 'P' },
    { value: 1E18, symbol: 'E' }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i -= 1) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
}
export default numFormatter;
