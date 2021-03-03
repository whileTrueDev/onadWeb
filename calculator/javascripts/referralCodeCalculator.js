const doQuery = require('../model/calculatorQuery');
// const pool = require('../model/connectionPool');

const CALCULATE_TARGET_STATE = 1; // 1=가입이후 연동완료
const CALCULATE_DONE_STATE = 2; // 2=계산 및 수익 반영완료
const EVENT_CASH_PAYOUT = 10; // 추천인 코드 이벤트 수익금 5000원

/**
 * 추천인 코드 이벤트 계산 대상 불러오는 함수
 * @author hwasurr
 * @return array of { referringCreatorId: string, referralCode: string, referredCreatorId: string }
 */
const getReferralCodeTargets = async () => {
  const query = `
  SELECT A.creatorId AS referringCreatorId, referralCode, B.creatorId AS referredCreatorId
  FROM creatorReferralCodeLogs as A
  JOIN creatorReferralCode AS B USING(referralCode)
  WHERE calculateState = ?
  `;
  return new Promise((resolve, reject) => {
    doQuery(query, [CALCULATE_TARGET_STATE])
      .then((rows) => {
        resolve(rows.result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 추천인 코드 이벤트 계산 대상을 토대로 수익금 5000원씩 추가하는 계산 진행하는 함수
 * 추천받은 A 방송인과 추천한 B 방송인 모두에게 5000원씩 지급한다.
 * @param {array} targets 추천인 코드 계산 대상 리스트
 * @author hwasurr
 */
const doIncomeCalculate = async (creatorId) => {
  const searchQuery = `
  SELECT creatorId, creatorTotalIncome, creatorReceivable 
  FROM creatorIncome
  WHERE creatorId = ?
  ORDER BY date DESC
  LIMIT 1
  `;

  return doQuery(searchQuery, [creatorId])
    .then((row) => {
      const { creatorTotalIncome, creatorReceivable } = row.result[0];

      const totalIncome = creatorTotalIncome + EVENT_CASH_PAYOUT;
      const receivable = creatorReceivable + EVENT_CASH_PAYOUT;

      return { totalIncome, receivable };
    })
    .then(async ({ totalIncome, receivable }) => {
      // 수익금 추가 쿼리
      const calculateQuery = `
      INSERT INTO creatorIncome
      (creatorId, creatorTotalIncome, creatorReceivable) 
      VALUES (?, ?, ?)`;

      return doQuery(calculateQuery, [creatorId, totalIncome, receivable])
        .catch((err) => { throw err; });
    })
    .catch((err) => { throw err; });
};

/**
 * 해당 추천인 코드의 계산 여부 컬럼을 계산완료(1)로 변경합니다.
 * @param {string} referralCode 추천인 코드
 * @author hwasurr
 */
const changeCalculateState = async (referralCode) => {
  const query = 'UPDATE creatorReferralCodeLogs SET calculateState = ? WHERE referralCode = ?';
  return doQuery(query, [CALCULATE_DONE_STATE, referralCode]).catch((err) => { throw err; });
};

/**
 * 해당 추천인 코드 연합(추천인 수익금, 추천받은 방송인 수익금, 추천인코드 플래그 작업)에 대한 계산을 실행합니다.
 * @param {object} param0 추천인 코드 계산 타겟
 * @author hwasurr
 */
const calculate = ({ referralCode, referringCreatorId, referredCreatorId }) => Promise.all([
  doIncomeCalculate(referredCreatorId),
  doIncomeCalculate(referringCreatorId),
  changeCalculateState(referralCode),
]);

async function referralCodeCalculate() {
  console.info('추천인 코드 이벤트 계산을 시작합니다.');

  // Find all referral code log list
  const targets = await getReferralCodeTargets();
  console.info('추천인 코드 이벤트 계산 타겟 수: ', targets.length);
  console.log(targets);

  return Promise.all(
    targets.map((target) => calculate({
      referralCode: target.referralCode,
      referringCreatorId: target.referringCreatorId,
      referredCreatorId: target.referredCreatorId,
    }))
  )
    .then(() => console.log(`[${new Date().toLocaleString()}] 추천인 코드 이벤트 계산을 완료하였습니다.`))
    .catch((err) => { throw err; });
}

module.exports = referralCodeCalculate;
