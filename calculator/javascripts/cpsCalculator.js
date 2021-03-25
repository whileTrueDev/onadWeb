/* eslint-disable max-len */
const doQuery = require('../model/calculatorQuery');

/**
 * 주문 목록 중, 
 * 주문의 상태가 "구매확정"(6) 이며, 계산완료플래그가 false인 목록을 불러옵니다.
 * 이 목록은 계산의 대상입니다.
 * @returns [
  {
    id: 1,
    campaignId: 'gubgoo_c34',
    merchandiseId: 34,
    orderPrice: 10000,
    calculateDoneFlag: 0,
    marketerId: 'gubgoo',
    name: '상품등록테스트',
    targetCreatorId: 130096343,
    creatorName: '화수르',
    statusString: '구매확정'
    }, ...
  ]
 */
const getTargets = async () => {
  const query = `
  SELECT
    MO.id, campaignId, merchandiseId, orderPrice, calculateDoneFlag,
    MR.marketerId, MR.name,
    MOC.creatorId AS targetCreatorId, creatorName,
    statusString
  FROM merchandiseOrders AS MO
  JOIN merchandiseRegistered AS MR ON MR.id = MO.merchandiseId
  JOIN merchandiseOrderStatuses AS MOS ON MOS.statusNumber = MO.status
  LEFT JOIN merchandiseOrderComments AS MOC ON MO.id = MOC.orderId
  LEFT JOIN creatorInfo ON MOC.creatorId = creatorInfo.creatorId
  WHERE statusString = ? AND calculateDoneFlag = ?`;

  const { result } = await doQuery(query, ['구매확정', false]);
  return result;
};

/**
 * CPS 캠페인 계산 작업을 실행합니다.
 * 1. 캠페인 계산 로그 처리 (campaignLog - campaignId, creatorId, type=CPS, cashToCreator, salesIncomeToMarketer)
 * 2. 광고주 판매대금 처리 (marketerSalesIncome - marketerId, 추가금액)
 * 3. 방송인 수익금 처리 (creatorIncome - creatorId, 추가금액)
 * 4. 모두 완료 후, 주문의 계산완료플래그를 true로 처리 (merchandiseOrders - calculateDoneFlag)
 */
const calculate = () => {

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

  // Find all referral code log list
  const targets = await getTargets().catch((err) => console.error(`CPS 계산 대상 목록 가져오는 도중 오류 - ${err}`));
  console.info('CPS 판매 대금 계산 타겟 수: ', targets.length);
  console.log(targets);

  // return Promise.all(
  //   targets.map((target) => calculate({
  //     referralCode: target.referralCode,
  //     referringCreatorId: target.referringCreatorId,
  //     referredCreatorId: target.referredCreatorId,
  //   }))
  // )
  //   .then(() => console.log(`[${new Date().toLocaleString()}] 추천인 코드 이벤트 계산을 완료하였습니다.`))
  //   .catch((err) => {
  //     console.log(`[${new Date().toLocaleString()}] 추천인 코드 이벤트 계산 중 오류 발생`);
  //     console.error(err);
  //     throw err;
  //   });
}

module.exports = cpsCalculate;
