/**
 * 전달받은 객체를 HTTP GET 메소드의 쿼리형태로 만들어주는 함수.
 * @param Object, 객체
 * @returns String, 문자열 - get요청 쿼리 형태의 문자열
 * @author hwasurr
*/
function querify(params = {}): string {
  let queryString = '?';

  Object.entries(params).forEach((value, index) => {
    queryString += (`${value[0]}=${value[1]}`);
    if (index < Object.entries.length) {
      queryString += '&';
    }
  });

  return queryString;
}

export default querify;
