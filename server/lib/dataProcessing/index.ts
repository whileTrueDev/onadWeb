// 데이터 가공 함수가 위치할 것임.
// 데이터 가공함수에서의 오류는 모두 throw new Error('에러메시지') 로 처리함.
// 요청자에게는 500 에러 가 전송될 것임. (에러메시지는 develop 환경에서만 볼 수 있음.)

import { QueryResult } from '../../@types/db';

// 예시함수.
function someDataProcessingFunction(rawData: QueryResult): QueryResult {
  const err = false; // 예시를 위해 에러를 무조건 나도록
  if (err) {
    throw new Error('여기서 에러가 났어요');
  }
  return rawData;
}

export default {
  someDataProcessingFunction
};
