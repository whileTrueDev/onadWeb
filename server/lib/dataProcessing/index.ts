// 데이터 가공 함수가 위치할 것임.
// 데이터 가공함수에서의 오류는 모두 throw new Error('에러메시지') 로 처리함.
// 요청자에게는 500 에러 가 전송될 것임. (에러메시지는 develop 환경에서만 볼 수 있음.)

import { QueryResult } from '../../@types/db';

interface WithrawalList {
  date: string;
  creatorWithdrawalAmount: number;
  withdrawalState: number
}

// 배열 인터페이스
interface Array<A, B> {
  length: number;
  [index: number]: A | B;
  map(arg: any): any
};


// 출금 내역에 대한 데이터 프로세싱
function withdrawalList(rawData: QueryResult): object {

  const rows: Array<string, number> = rawData.result;
  const columns: Array<string, number> = Object.keys(rows[0]).map(col =>
    col.replace('date', '출금날짜')
      .replace('creatorWithdrawalAmount', '출금금액')
      .replace('withdrawalState', '신청상태'));

  // dataset preprocessing
  const data: Array<string, number> = rows.map(
    (value: WithrawalList) => {
      const obj = [];
      obj.push(value.date.toLocaleString());
      obj.push(value.creatorWithdrawalAmount.toLocaleString());
      obj.push(value.withdrawalState === 0 ? '정산대기⏰' : '완료됨👌');
      return obj;
    }
  );
  return { columns, data };
}

export default {
  withdrawalList
};
