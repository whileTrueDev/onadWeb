const schedule = require('node-schedule');
const doQuery = require('../../model/doQuery');
const slack = require('../slack/message');

const WAIT_STATE = 0;
const FAIL_STATE = 2;
const DATE = new Date();
let THIS_MONTH = '';
if ((DATE.getMonth() + 1).toString().length < 2) {
  THIS_MONTH = `${DATE.getFullYear()}-0${(DATE.getMonth() + 1)}-00`;
} else {
  THIS_MONTH = `${DATE.getFullYear()}-${(DATE.getMonth() + 1)}-00`;
}

/**
 * @description 세금계산테이블(marketerTaxBill)의 매 달 세금계산서 발행 실패 시 함수
 * -
 * - 발행 실패는 사업자 등록증을 업로드 하지 않은 경우, 또는 모종의 이유.
 */
function taxBillFailJob() {
  // 현재의 달보다 이전의 달인 모든행의 STATE가 WAIT인 경우 => FAIL로 수정
  // 11월 1일 0시 1분의 작업 : 10월 까지의 모든 행의 STATE를 체크하여, WAIT => FAIL로 수정
  const updateQuery = 'UPDATE marketerTaxBill SET state = ? WHERE state = ? AND date < ?';
  const updateArray = [FAIL_STATE, WAIT_STATE, THIS_MONTH];

  return new Promise((resolve, reject) => {
    const result = { insert: { error: null, success: false } };

    doQuery(updateQuery, updateArray).then((row) => {
      if (!row.error && row.result.affectedRows) {
        result.insert = { error: null, success: true };
        resolve(result);
      } else {
        result.insert = { error: null, success: true };
        resolve(result);
      }
    }).catch((err) => {
      console.log('[ERROR - taxbill fail job] [1.insert fail]', err);
      result.insert = { error: err, success: false };
      reject(result);
    });
  });
}

/**
 * @description 세금계산테이블(marketerTaxBill)의 매 달 기본값 할당 함수
 */
function taxBillDefaultJob() {
  return new Promise((resolve, reject) => {
    const result = {
      select: { error: null, success: false },
      existsCheck: { error: null, success: false },
      insert: { error: null, success: false }
    };

    let marketers = []; let alreadyExistsMarketers = [];
    const selectQuery = 'SELECT marketerId FROM marketerInfo';
    const existsQuery = `SELECT marketerId FROM marketerTaxBill WHERE date = "${THIS_MONTH}"`;
    const insertQuery = 'INSERT INTO marketerTaxBill (marketerId, date, state) VALUES';
    let insertQueryValues = '';
    let insertArray = [];

    // Select all marketer's ID
    doQuery(selectQuery).then((row) => {
      if (!row.error && row.result.length > 0) {
        // ser select results
        result.select = { ...result.select, success: true };

        marketers = row.result.map(m => m.marketerId);

        // Check query for tax bill data already exists
        doQuery(existsQuery)
          .then((existsRow) => {
            if (!existsRow.error && existsRow.result.length > 0) {
              // ser existsCheck results
              result.existsCheck = { ...result.existsCheck, success: true };

              alreadyExistsMarketers = existsRow.result.map(m => m.marketerId);

              // Compare then Separate dosen't inserted marketerids
              marketers = marketers.filter(val => !alreadyExistsMarketers.includes(val));
            }

            // Make taxbill insert query
            marketers.map((marketer, index) => {
              if (index === marketers.length - 1) {
                insertQueryValues = insertQueryValues.concat('\n(?, ?, ?)');
                insertArray = insertArray.concat([marketer, THIS_MONTH, WAIT_STATE]);
                return null;
              }
              insertQueryValues = insertQueryValues.concat('\n(?, ?, ?),');
              insertArray = insertArray.concat([marketer, THIS_MONTH, WAIT_STATE]);
              return null;
            });

            if (marketers.length > 0) {
              // Insert Query marketer taxbill default value
              doQuery(insertQuery + insertQueryValues, insertArray)
                .then((insertQueryResult) => {
                  console.log('insertQuery + insertQueryValues Done');
                  if (!insertQueryResult.error && insertQueryResult.result.affectedRows) {
                    // ser insert results
                    result.insert = { ...result.insert, success: true };

                    resolve(result);
                  }
                })
                .catch((err) => {
                  result.insert = { success: false, error: err };
                  reject(result);
                  console.log('[ERROR - taxbill default job] [3.insert fail]', err);
                });
            } else {
              console.log(THIS_MONTH, '[taxbill default job] NO MARKETERS FOR THIS JOB!');
              result.insert = { ...result.insert, success: true };
              resolve(result);
            }
          })
          .catch((err) => {
            result.existsCheck = { success: false, error: err };
            reject(result);
            console.log('[ERROR - taxbill default job] [2.exists search fail]', err);
          });
      } else {
        resolve({ error: null, success: true });
      }
    }).catch((err) => {
      result.select = { success: false, error: err };
      reject(result);
      console.log('[ERROR - taxbill default job] [1.search fail]', err);
    });
  });
}

// 매 달 1일에 0시 1분에 실행.
const scheduler = schedule.scheduleJob('taxbillScheduler', '1 0 1 * *', () => {
  console.log(`[${new Date().toLocaleString()}] START SCHEDULER JOB - [taxbillScheduler]`);

  // tax bill issue fail job
  taxBillFailJob().then((failjobResult) => {
    console.log(`START [WAIT => FAIL] [${THIS_MONTH}] JOB...`);
    const { insert } = failjobResult;
    if (insert.success) {
      console.log(`SUCCESS [WAIT => FAIL] [${THIS_MONTH}] JOB SUCCESS!!`);
    }

    // insert default value job
    taxBillDefaultJob().then((result) => {
      console.log(`START [INSERT DEFAULT VALUE] [${THIS_MONTH}] JOB...`);
      if (result.select.success && result.existsCheck.success && result.insert.success) {
        console.log(`SUCCESS [INSERT DEFAULT VALUE] [${THIS_MONTH}] JOB SUCCESS!!`);

        // notification function
        slack.push(
          `[SUCCESS] marketerTaxBill 테이블의 ${THIS_MONTH} 기본값 설정이 올바르게 완료되었습니다.`,
          'SCHEDULER JOB - [taxbillScheduler]', 'onad_web_api'
        );
      }
    }).catch((err) => {
      console.log('ERROR occurred! check taxBillScheduler - defaultJob');
      console.log(err);

      // notification function
      slack.push(`[ERROR] marketerTaxBill 테이블의 ${THIS_MONTH} 기본값 설정이 실패했습니다.
      에러메시지 : 
      ${err}`, 'SCHEDULER JOB - [taxbillScheduler]', 'onad_web_api');
    });
  }).catch((err) => {
    console.log('ERROR occurred! check taxBillScheduler - taxBillFailJob');
    console.log(err);

    // notification function
    slack.push(`[ERROR] marketerTaxBill 테이블의 ${THIS_MONTH} 기본값 설정이 실패했습니다.
    에러메시지 : 
    ${err}`, 'SCHEDULER JOB - [taxbillScheduler]', 'onad_web_api');
  });
});

module.exports = scheduler;
