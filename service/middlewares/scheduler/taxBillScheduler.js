const schedule = require('node-schedule');
const doQuery = require('../../model/doQuery');
const makeInsertQuery = require('./util/makeInsertQuery');
const slack = require('../slack/message');

const WAIT_STATE = 0; // '발행대기' 상태값
const FAIL_STATE = 2; // '미발행' 상태값

/**
 * 1. 매 월 1일, marketerTaxBill 테이블에 모든 마케터 Row - 전월의 데이터를 생성한다.
 * 2. 캐시 충전 내역이 있는 경우 마케터당 전월 총 캐시 충전량을 적재한다.
 * @return Promise<object[]>, insert 해야 할 마케터 세금계산서 데이터를 담고 있는 배열
 */
function getInsertData() {
  // 전월 날짜 구하기.
  const previousMonthObject = new Date();
  previousMonthObject.setMonth(previousMonthObject.getMonth() - 1);
  let previousMonth;
  if ((previousMonthObject.getMonth() + 1).toString().length < 2) {
    previousMonth = `${previousMonthObject.getFullYear()}-0${previousMonthObject.getMonth() + 1}-00`;
  } else {
    previousMonth = `${previousMonthObject.getFullYear()}-${previousMonthObject.getMonth() + 1}-00`;
  }
  return new Promise((resolve, reject) => {
    // 모든 마케터를 가져오는 쿼리.
    const getMarketersQuery = 'SELECT marketerId FROM marketerInfo';

    // 전월의 충전내역을 가져오는 쿼리. ( 카드 결제 제외 )
    const checkChargeQuery = `
    SELECT
    mc.marketerId, SUM(cash) AS cashAmount,
    DATE_FORMAT(mc.date, '%Y-%m') AS date
    
    FROM marketerCharge AS mc
    WHERE mc.temporaryState = 1
      AND DATE_FORMAT(mc.date, '%Y-%m') = DATE_FORMAT(DATE_SUB(now(), INTERVAL 1 MONTH), '%Y-%m')
      AND type != '신용카드'
      AND temporaryState != 2
      
    GROUP BY DATE_FORMAT(mc.date, '%Y-%m'), marketerId
    `;

    Promise.all([
      doQuery(getMarketersQuery),
      doQuery(checkChargeQuery),
    ])
      .then((rowList) => {
        if (!rowList[0].error && !rowList[1].error) {
          const marketerInfo = rowList[0].result; // marketerInfo
          const marketerCharge = rowList[1].result; // marketerCharge

          const marketerIds = marketerInfo.map(marketer => marketer.marketerId);

          marketerIds.forEach((id, index) => {
            // date에 전월 할당
              marketerInfo[index].date = previousMonth;
              marketerCharge.forEach((m) => {
              // 캐시내역 없는 경우 기본값 0 추가
              if (!marketerInfo[index].cashAmount) {
                marketerInfo[index].cashAmount = 0;
              }

              // marketerId 확인하여 캐시내역 있는 경우 추가
              if (m.marketerId === id) {
                marketerInfo[index].cashAmount = m.cashAmount;
              }
            });
          });
          resolve(marketerInfo);
        } else {
          reject(Error('An error occurred in TaxBillJob query'));
        }
      });
  });
}

/**
 * 전전월의 '발행대기' state를 '미발행' state 로 수정하는 작업.
 */
function updateFail() {
  // 전전월의 '발행대기' 상태를 '미발행' 상태로 바꾸는 쿼리
  const failUpdateQuery = `
  UPDATE marketerTaxBill
  SET state = ?
  WHERE 
    date = DATE_FORMAT(DATE_SUB(now(), INTERVAL 2 MONTH), '%Y-%m-00')
    AND state = ?`;
  const failUpdateArray = [FAIL_STATE, WAIT_STATE];

  return doQuery(failUpdateQuery, failUpdateArray)
    .then((row) => {
      if (!row.error && row.result) {
        console.log(row.result);
      }
    });
}

const scheduler = schedule.scheduleJob(
  'Marketer taxbill scheduler', '1 10 1 * *', () => {
    // 전전월의 발행대기 => 미발행으로 변경 작업.
    updateFail()
    .then(() => {
      slack.push('마케터 세금계산서 미발행처리 완료.', '마케터 세금계산서');

      // 삽입할 데이터 가져오기
      getInsertData().then((data) => {
        // 삽입 쿼리 생성
        const q = makeInsertQuery(data);

        // 이전 월, '발행 대기', 삽입 작업.
        doQuery(q.queryString, q.queryArray).then(() => {
          slack.push('마케터 세금계산서 데이터 Insert 완료.', '마케터 세금계산서');
        }).catch((err) => {
          console.log(err);
          slack.push('마케터 세금계산서 데이터 Insert 중 오류발생함.', '마케터 세금계산서');
        });
      });
    })
    .catch((err) => {
      console.log(err);
      slack.push('마케터 세금계산서 미발행처리 중 오류발생함.', '마케터 세금계산서');
    });

  }
);
module.exports = scheduler;
