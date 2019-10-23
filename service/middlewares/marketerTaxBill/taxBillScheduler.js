const schedule = require('node-schedule');
const doQuery = require('../../model/doQuery');

const SUCCESS_STATE = 1;
const WAIT_STATE = 0;
const FAIL_STATE = 2;

/**
 * @description 세금계산테이블(marketerTaxBill)의 매 달 기본값 할당 함수
 */
function taxBillJobDefault() {
  // 모든 마케터를 select

  // 모든 마케터만큼 새로운 행(해당 월에 해당하는)을 insert
  const selectQuery = '';

  const query = `INSERT
  INTO marketerTaxBill
  VALUES (?, ?, ?)`;
  const queryArray = [];
}

/**
 * @description 세금계산테이블(marketerTaxBill)의 매 달 세금계산서 발행 실패 시 함수
 * - 발행 실패는 사업자 등록증을 업로드 하지 않은 경우, 또는 모종의 이유.
 */
function taxBillJobFail() {
  // 현재의 달보다 이전의 달인 모든행의 STATE가 WAIT인 경우 => FAIL로 수정

  // 11월 1일 0시 1분의 작업 : 10월 까지의 모든 행의 STATE를 체크하여, WAIT => FAIL로 수정
  const query = '';
  const queryArray = '';
}

// 매 달 1일에 0시 1분에 실행.
const scheduler = schedule.scheduleJob('taxbillScheduler', '1 0 1 * *', () => {
  taxBillJobDefault();
  taxBillJobFail();
});

module.exports = scheduler;
