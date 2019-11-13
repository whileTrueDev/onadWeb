/**
 * 배열을 입력받은 숫자에 맞추어 나누어, 2중 배열 형태로 반환하는 함수.
 * @param {Array} array 나눌 배열
 * @param {Number} n 해당 배열을 나눌 숫자
 */
function divide(array, n) {
  const arr = array;
  const len = array.length;
  const cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
  const tmp = [];

  for (let i = 0; i < cnt; i += 1) {
    tmp.push(arr.splice(0, n));
  }
  return tmp;
}

module.exports = divide;
