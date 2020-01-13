const schedule = require('node-schedule');
const doQuery = require('../../model/doQuery');
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
  previousMonthObject.setMonth(-1);
  let previousMonth;
  if ((previousMonthObject.getDate() + 1).toString().length < 2) {
    previousMonth = `${previousMonthObject.getFullYear()}-0${previousMonthObject.getMonth() + 1}-00`;
  } else {
    previousMonth = `${previousMonthObject.getFullYear()}-${previousMonthObject.getMonth() + 1}-00`;
  }

  return new Promise((resolve, reject) => {
    // 모든 마테터를 가져오는 쿼리.
    const getMarketersQuery = 'SELECT marketerId FROM marketerInfo';
    // 전월의 충전내역을 가져오는 쿼리.
    const checkChargeQuery = `
    SELECT
    mc.marketerId, SUM(cash) AS cashAmount,
    DATE_FORMAT(mc.date, '%Y-%m') AS date
    
    FROM marketerCharge_copy AS mc
    WHERE mc.temporaryState = 1
      AND DATE_FORMAT(mc.date, '%Y-%m') = DATE_FORMAT(DATE_SUB(now(), INTERVAL 1 MONTH), '%Y-%m')
      
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
 * 전전월의 '발행대기' state를 '미발행' state 로 수정한다.
 */
function updateFail() {
  // 전전월의 '발행대기' 상태를 '미발행' 상태로 바꾸는 쿼리
  const failUpdateQuery = `
  UPDATE marketerTaxBill_copy
  SET state = ?
  WHERE 
    date = DATE_FORMAT(DATE_SUB(now(), INTERVAL 2 MONTH), '%Y-%m-00')
    AND state = ?`;
  const failUpdateArray = [FAIL_STATE, WAIT_STATE];

  doQuery(failUpdateQuery, failUpdateArray)
    .then((row) => {
      if (!row.error && row.result) {
        console.log(row.result);
      }
    });
}

function getInsertQuery(data) {
  let queryString = `
  INSERT INTO
  marketerTaxBill_copy (marketerId, date, state, cashAmount)
  VALUES
  `;

  const valuesString = '(?, ?, ?, ?)';
  const comma = ',\n';

  const queryArray = [];
  data.forEach((d, index) => {
    queryString += valuesString;
    if (index !== data.length - 1) {
      queryString += comma;
    }
    queryArray.push(d.marketerId, d.date, 0, d.cashAmount);
  });

  return { queryString, queryArray };
}

const scheduler = schedule.scheduleJob('a', '* * * * *', () => {
  getInsertData().then((data) => {
    const q = getInsertQuery(data);
    doQuery(q.queryString, q.queryArray).then((row) => {
      console.log(row.result);
    }).catch((err) => {
      console.log(err);
    });
  });
});

// // 매 달 1일에 0시 1분에 실행.
// const scheduler = schedule.scheduleJob('taxbillScheduler', '1 9 1,4,7,10,13,16,19,22,25,28 * *', () => {
//   console.log(`[${new Date().toLocaleString()}] START SCHEDULER JOB - [taxbillScheduler]`);

//   // tax bill issue fail job
//   taxBillFailJob().then((failjobResult) => {
//     console.log(`START [WAIT => FAIL] [${THIS_MONTH}] JOB...`);
//     const { insert } = failjobResult;
//     if (insert.success) {
//       console.log(`SUCCESS [WAIT => FAIL] [${THIS_MONTH}] JOB SUCCESS!!`);
//     }

//     // insert default value job
//     taxBillDefaultJob().then((result) => {
//       console.log(`START [INSERT DEFAULT VALUE] [${THIS_MONTH}] JOB...`);
//       if (result.select.success && result.existsCheck.success && result.insert.success) {
//         console.log(`SUCCESS [INSERT DEFAULT VALUE] [${THIS_MONTH}] JOB SUCCESS!!`);

//         // notification function
//         slack.push(
//           `[SUCCESS] marketerTaxBill 테이블의 ${THIS_MONTH} 기본값 설정이 올바르게 완료되었습니다.`,
//           'SCHEDULER JOB - [taxbillScheduler]', 'onad_web_api'
//         );
//       }
//     }).catch((err) => {
//       console.log('ERROR occurred! check taxBillScheduler - defaultJob');
//       console.log(err);

//       // notification function
//       slack.push(`[ERROR] marketerTaxBill 테이블의 ${THIS_MONTH} 기본값 설정이 실패했습니다.
//       에러메시지 :
//       ${err}`, 'SCHEDULER JOB - [taxbillScheduler]', 'onad_web_api');
//     });
//   }).catch((err) => {
//     console.log('ERROR occurred! check taxBillScheduler - taxBillFailJob');
//     console.log(err);

//     // notification function
//     slack.push(`[ERROR] marketerTaxBill 테이블의 ${THIS_MONTH} 기본값 설정이 실패했습니다.
//     에러메시지 :
//     ${err}`, 'SCHEDULER JOB - [taxbillScheduler]', 'onad_web_api');
//   });
// });

module.exports = scheduler;
