/* eslint-disable max-len */
const doQuery = require('../model/calculatorQuery');
const pool = require('../model/connectionPool');
const {
  getUpdateFlag,
  getInsertCampaignLog,
  getCalculateCreatorIncome,
  getCalculateMarketerSalesIncome,
} = require('../utils/cps/queries');
const { getFeeCalculatedTargets } = require('../utils/cps/commission');
const generateOptimizedDataSet = require('../utils/cps/generateOptimizedDataSet');

/**
 * 주문 목록 중, 
 * 주문의 상태가 "구매확정"(6) 이며, 계산완료플래그가 false인 목록을 불러옵니다.
 * 이 목록은 계산의 대상입니다.
 * @returns {Array} [
  {
    id: 1, campaignId: 'gubgoo_c34', merchandiseId: 34,
    orderPrice: 10000, calculateDoneFlag: 0, marketerId: 'gubgoo',
    name: '상품등록테스트', targetCreatorId: 130096343,
    statusString: '구매확정', creatorCommission: 0.1, onadCommission: 0.1
  }, ...
  ]
 */
const getTargets = async () => {
  const query = `
  SELECT
    MO.id, campaignId, merchandiseId, orderPrice, calculateDoneFlag, deliveryFee,
    MR.marketerId, MR.name,
    MOC.creatorId AS targetCreatorId,
    statusString,
    creatorCommission, onadCommission
  FROM merchandiseOrders AS MO
  JOIN merchandiseRegistered AS MR ON MR.id = MO.merchandiseId
  JOIN merchandiseOrderStatuses AS MOS ON MOS.statusNumber = MO.status
  LEFT JOIN merchandiseOrderComments AS MOC ON MO.id = MOC.orderId
  LEFT JOIN creatorInfo ON MOC.creatorId = creatorInfo.creatorId
  WHERE statusString = ? AND calculateDoneFlag = ? AND isLiveCommerce = ?`;

  const { result } = await doQuery(query, ['구매확정', false, false]) // 실 구동시, "구매확정"
    .catch(err => `error occurred during run getTargets - ${err}`);

  return result;
};

// Livecommerce 계산 대상을 가져옵니다. 처리 이후 반환되는 값은 CPS 계산타겟과 동일한 형태를 가집니다.
const getLiveCommerceTargets = async () => {
  const query = `
  SELECT
    MO.id, MO.campaignId, MO.merchandiseId, orderPrice, calculateDoneFlag, deliveryFee,
    MR.marketerId, MR.name, creatorCommission, onadCommission,
    statusString,
    campaign.targetList
  FROM merchandiseOrders AS MO
  JOIN merchandiseRegistered AS MR ON MR.id = MO.merchandiseId
  JOIN merchandiseOrderStatuses AS MOS ON MOS.statusNumber = MO.status
   JOIN campaign ON campaign.campaignId = MO.campaignId
  WHERE statusString = ? AND calculateDoneFlag = ? AND isLiveCommerce = ?`;

  const { result } = await doQuery(query, ['구매확정', false, true]) // 실 구동시, "구매확정"
    .catch(err => `error occurred during run getTargets - ${err}`);

  return result.map(res => ({
    ...res,
    targetCreatorId: JSON.parse(res.targetList).targetList[0], // 라이브커머스는 언제나 1명. (2명이상일 시 무시)
  }));
};

/**
 * CPS 캠페인 계산 작업을 실행합니다.
 * 1. 캠페인 계산 로그 처리 (campaignLog - campaignId, creatorId, type=CPS, cashToCreator, salesIncomeToMarketer)
 * 2. 광고주 판매대금 처리 (marketerSalesIncome - marketerId, 추가금액)
 */
async function calculate(conn, { marketerId, cashToCreators, salesIncomeToMarketer, deliveryFee }) {
  // * 1. 광고주 판매대금 처리 (marketerSalesIncome - marketerId, 추가금액)
  const salesIncome = getCalculateMarketerSalesIncome({
    marketerId,
    salesIncomeToMarketer,
    deliveryFee,
  });
  await conn.query(salesIncome.query, salesIncome.queryArray);

  // * 2. 방송인 수익금 처리 (creatorIncome - creatorId, 추가금액)
  await Promise.all(
    cashToCreators.map(async ({ amount, creatorId }) => {
      const creatorIncome = getCalculateCreatorIncome({ creatorId, cashToCreator: amount });
      if (creatorIncome) {
        return conn.query(creatorIncome.query, creatorIncome.queryArray);
      }
      return null;
    }),
  );
  console.log(
    `[${new Date().toLocaleString()}] 광고주${marketerId} (방송인: ${cashToCreators.map(
      x => x.creatorId,
    )}) 계산 완료`,
  );
}

// * 3. 모두 완료 후, 주문의 계산완료플래그를 true로 처리 (merchandiseOrders - calculateDoneFlag)
const updateCalculateDoneFlag = (conn, orderId) => {
  const flag = getUpdateFlag({ orderId });
  return conn.query(flag.query, flag.queryArray);
};

// * 4. 모두 완료 후, 주문의 계산완료플래그를 true로 처리 (merchandiseOrders - calculateDoneFlag)
const updateCampaignLog = (conn, feeCalculatedTargets) => {
  // * 4. 캠페인 계산 로그 처리 (campaignLog - campaignId, creatorId, type=CPS, cashToCreator, salesIncomeToMarketer)
  const campaignLog = getInsertCampaignLog(feeCalculatedTargets);
  return conn.query(campaignLog.query, campaignLog.queryArray);
};

/**
 * ### CPS 계산 정책
 * 1. 방송인 A로부터 유입된 시청자가 구입 + 인증(리뷰or자랑하기)**글을 남기고** 구매완료 시
 *    - 기본 ⇒ 광고주 70 %, 방송인 A 20 %, 온애드 10 %
 *    (`merchandiseRegistered.creatorCommission`와 `merchandiseRegistered.onadCommission` 값에 의해 달라질 수 있다.)
 *
 * 2. 방송인 A로부터 유입된 시청자가 구입 + 인증(리뷰or자랑하기)**글을 남기지 않고** 구매완료 시
 *    - 기본 **⇒ 광고주 90 %, 온애드 10 %**
 *    (`merchandiseRegistered.onadCommission` 값에 의해 달라질 수 있다.)
 */
async function cpsCalculate() {
  console.info('[CPS|라이브커머스] 판매 대금 계산을 시작합니다.');

  const cpsTargets = await getTargets().catch(err =>
    console.error(`CPS 계산 대상 목록 가져오는 도중 오류 - ${err}`),
  );
  const liveCommeerceTargets = await getLiveCommerceTargets().catch(err =>
    console.error(`[liveCommerce] 계산 대상 목록 가져오는 도중 오류 - ${err}`),
  );

  const targets = cpsTargets.concat(liveCommeerceTargets);
  const feeCalculatedTargets = getFeeCalculatedTargets(targets);
  console.info('[CPS|라이브커머스] 판매 대금 계산 타겟 수: ', targets.length);

  const calcTargets = generateOptimizedDataSet(feeCalculatedTargets);
  calcTargets.forEach(t => {
    console.log(t);
  });

  const conn = await pool.promise().getConnection();
  try {
    await conn.beginTransaction();

    if (targets.length === 0) {
      console.log(`[${new Date().toLocaleString()}] 계산 타겟 없으므로 종료`);
      conn.release();
      return '계산 타겟 없음';
    }

    // * 1. 광고주 판매대금 처리 (marketerSalesIncome - marketerId, 추가금액)
    // * 2. 방송인 수익금 처리 (creatorIncome - creatorId, 추가금액)
    await Promise.all(calcTargets.map(target => calculate(conn, target)));

    // * 3. 모두 완료 후, 주문의 계산완료플래그를 true로 처리
    await Promise.all(targets.map(t => updateCalculateDoneFlag(conn, t.id))).then(() =>
      console.log(`[${new Date().toLocaleString()}] 모든 주문의 계산완료플래그를 true로 처리 완료`),
    );

    // * 4. 캠페인 계산 로그 처리
    await updateCampaignLog(conn, feeCalculatedTargets).then(() =>
      console.log(`[${new Date().toLocaleString()}] 모든 주문의 캠페인 계산 로그 처리 완료`),
    );

    console.log(
      `[${new Date().toLocaleString()}] [CPS|라이브커머스] 판매 대금 계산을 모두 완료하였습니다.`,
    );
    return conn.commit();
  } catch (e) {
    await conn.rollback();
    console.error(
      `[${new Date().toLocaleString()}] [CPS|라이브커머스] 판매 대금 계산 중 오류 발생`,
    );
    console.error(e);
    throw e;
  } finally {
    await conn.release();
  }
}

module.exports = cpsCalculate;
