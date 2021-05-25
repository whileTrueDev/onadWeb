/* eslint-disable max-len */
const doQuery = require('../model/calculatorQuery');
const pool = require('../model/connectionPool');
const {
  getUpdateFlag, getInsertCampaignLog, getCalculateCreatorIncome, getCalculateMarketerSalesIncome
} = require('../utils/cps/queries');

/**
   * 각 유저별 계산 대금을 구합니다. 리뷰/자랑하기/응원하기 글의 대상인 방송인이 있는 지 여부를 기준으로
   * 계산 대금은 다르게 계산됩니다.
   * @author hwasurr
   * @param { number } orderPrice 계산이 필요한 판매 대금
   * @param { boolean } isCreatorExists 리뷰/자랑하기/응원하기 글의 대상인 방송인이 있는지 여부
   * 1. 방송인 A로부터 유입된 시청자가 구입 + 인증(리뷰or자랑하기)**글을 남기고** 구매완료 시
   *    - **⇒ 광고주 70 %, 방송인 A 20 %, 온애드 10 %**
   * 
   * 2. 방송인 A로부터 유입된 시청자가 구입 + 인증(리뷰or자랑하기)**글을 남기지 않고** 구매완료 시
   *    - **⇒ 광고주 90 %, 온애드 10 %**
   */
const getCashesCalculated = ({
  totalOrderPrice, isCreatorExists, creatorCommission, onadCommission
}) => {
  if (isCreatorExists) { // 1 번의 경우
    const cashToCreator = Math.round(totalOrderPrice * creatorCommission);
    const cashToOnad = Math.round(totalOrderPrice * onadCommission);
    const salesIncomeToMarketer = totalOrderPrice - cashToCreator - cashToOnad;
    return { cashToCreator, salesIncomeToMarketer };
  }
  const cashToCreator = 0;
  const cashToOnad = Math.round(totalOrderPrice * onadCommission);
  const salesIncomeToMarketer = totalOrderPrice - cashToOnad;
  return { cashToCreator, salesIncomeToMarketer };
};

/**
 * 주문 목록 중, 
 * 주문의 상태가 "구매확정"(6) 이며, 계산완료플래그가 false인 목록을 불러옵니다.
 * 이 목록은 계산의 대상입니다.
 * @returns {Array} [
  {
    id: 1, campaignId: 'gubgoo_c34', merchandiseId: 34,
    orderPrice: 10000, calculateDoneFlag: 0, marketerId: 'gubgoo',
    name: '상품등록테스트', targetCreatorId: 130096343,
    creatorName: '화수르', statusString: '구매확정'
  }, ...
  ]
 */
const getTargets = async () => {
  const query = `
  SELECT
    MO.id, campaignId, merchandiseId, orderPrice, calculateDoneFlag, deliveryFee,
    MR.marketerId, MR.name,
    MOC.creatorId AS targetCreatorId, creatorName,
    statusString,
    creatorCommission, onadCommission
  FROM merchandiseOrders AS MO
  JOIN merchandiseRegistered AS MR ON MR.id = MO.merchandiseId
  JOIN merchandiseOrderStatuses AS MOS ON MOS.statusNumber = MO.status
  LEFT JOIN merchandiseOrderComments AS MOC ON MO.id = MOC.orderId
  LEFT JOIN creatorInfo ON MOC.creatorId = creatorInfo.creatorId
  WHERE statusString = ? AND calculateDoneFlag = ? AND isLiveCommerce = ?`;

  const { result } = await doQuery(query, ['구매확정', false, false])
    .catch((err) => `error occurred during run getTargets - ${err}`);
  return result;
};

/**
 * CPS 캠페인 계산 작업을 실행합니다.
 * 1. 캠페인 계산 로그 처리 (campaignLog - campaignId, creatorId, type=CPS, cashToCreator, salesIncomeToMarketer)
 * 2. 광고주 판매대금 처리 (marketerSalesIncome - marketerId, 추가금액)
 * 3. 방송인 수익금 처리 (creatorIncome - creatorId, 추가금액)
 * 4. 모두 완료 후, 주문의 계산완료플래그를 true로 처리 (merchandiseOrders - calculateDoneFlag)
 */
const calculate = async ({
  orderId, campaignId, merchandiseId, orderPrice, calculateDoneFlag,
  marketerId, name, targetCreatorId, creatorName, statusString, deliveryFee,
  creatorCommission, onadCommission,
}) => {
  const { cashToCreator, salesIncomeToMarketer } = getCashesCalculated({
    totalOrderPrice: orderPrice,
    isCreatorExists: !!targetCreatorId,
    creatorCommission,
    onadCommission,
  });
  const conn = await pool.promise().getConnection();

  try {
    conn.beginTransaction();

    // * 1. 광고주 판매대금 처리 (marketerSalesIncome - marketerId, 추가금액)
    const salesIncome = getCalculateMarketerSalesIncome({ marketerId, salesIncomeToMarketer, deliveryFee });
    await conn.query(salesIncome.query, salesIncome.queryArray);

    // * 2. 방송인 수익금 처리 (creatorIncome - creatorId, 추가금액)
    if (targetCreatorId) {
      const creatorIncome = getCalculateCreatorIncome({ creatorId: targetCreatorId, cashToCreator });
      if (creatorIncome) {
        await conn.query(creatorIncome.query, creatorIncome.queryArray);
      }
    }

    // * 3. 캠페인 계산 로그 처리 (campaignLog - campaignId, creatorId, type=CPS, cashToCreator, salesIncomeToMarketer)
    const campaignLog = getInsertCampaignLog({
      campaignId,
      creatorId: targetCreatorId,
      cashToCreator,
      salesIncomeToMarketer,
    });
    await conn.query(campaignLog.query, campaignLog.queryArray);

    // * 4. 모두 완료 후, 주문의 계산완료플래그를 true로 처리 (merchandiseOrders - calculateDoneFlag)
    const flag = getUpdateFlag({ orderId });
    await conn.query(flag.query, flag.queryArray);

    conn.commit();
    console.log(`[${new Date().toLocaleString()}] ${campaignId} 캠페인 (상품: ${name}, 방송인: ${creatorName || '없음'}) 계산 완료`);
  } catch (e) {
    conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};

/**
 * ### CPS 계산 정책
 * 
 * 1. 방송인 A로부터 유입된 시청자가 구입 + 인증(리뷰or자랑하기)**글을 남기고** 구매완료 시
 *    - ⇒ 광고주 70 %, 방송인 A 20 %, 온애드 10 %
 * 
 * 2. 방송인 A로부터 유입된 시청자가 구입 + 인증(리뷰or자랑하기)**글을 남기지 않고** 구매완료 시
 *    - **⇒ 광고주 90 %, 온애드 10 %**
 */
async function cpsCalculate() {
  console.info('CPS 판매 대금 계산을 시작합니다.');

  const targets = await getTargets().catch((err) => console.error(`CPS 계산 대상 목록 가져오는 도중 오류 - ${err}`));
  console.info('CPS 판매 대금 계산 타겟 수: ', targets.length);

  return Promise.all(
    targets.map((target) => calculate({
      orderId: target.id,
      campaignId: target.campaignId,
      merchandiseId: target.merchandiseId,
      orderPrice: target.orderPrice,
      deliveryFee: target.deliveryFee,
      calculateDoneFlag: target.calculateDoneFlag,
      marketerId: target.marketerId,
      name: target.name,
      targetCreatorId: target.targetCreatorId,
      creatorName: target.creatorName,
      statusString: target.statusString,
      creatorCommission: target.creatorCommission,
      onadCommission: target.onadCommission
    }))
  )
    .then(() => console.log(`[${new Date().toLocaleString()}] CPS 판매 대금 계산을 모두 완료하였습니다.`))
    .catch((err) => {
      console.error(`[${new Date().toLocaleString()}] CPS 판매 대금 계산 중 오류 발생`);
      console.error(err);
      return 0;
    });
}

module.exports = cpsCalculate;
