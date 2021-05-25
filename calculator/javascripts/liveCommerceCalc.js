const pool = require('../model/connectionPool');
const { doQuery } = require('../model/doQuery');

const getTargets = async () => {
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

  const { result } = await doQuery(query, ['구매확정', 0, true])
    .catch((err) => `error occurred during run getTargets - ${err}`);

  return result.map((res) => ({
    ...res,
    targetCreatorId: JSON.parse(res.targetList).targetList[0], // 라이브커머스는 언제나 1명. (2명이상일 시 무시)
  }));
};

const getCashesCalculated = ({ orderPrice, creatorCommission, onadCommission }) => {
  const cashToCreator = Math.round(orderPrice * creatorCommission);
  const cashToOnad = Math.round(orderPrice * onadCommission);
  const salesIncomeToMarketer = orderPrice - cashToCreator - cashToOnad;
  return { cashToCreator, salesIncomeToMarketer };
};

const calculateMarketerSalesIncome = ({ marketerId, salesIncomeToMarketer, deliveryFee }) => {
  const query = `
  INSERT INTO marketerSalesIncome (marketerId, totalIncome, receivable, totalDeliveryFee, receivableDeliveryFee) 
  SELECT
    marketerId,
    IFNULL(MAX(totalIncome), 0) + ? AS totalIncome,
    IFNULL(MAX(receivable), 0) + ? AS receivable,
    IFNULL(MAX(totalDeliveryFee), 0) + ? AS totalDeliveryFee,
    IFNULL(MAX(receivableDeliveryFee), 0) + ? AS receivableDeliveryFee
  FROM marketerSalesIncome AS a WHERE marketerId = ? ORDER BY createDate DESC LIMIT 1`;
  const queryArray = [
    salesIncomeToMarketer, salesIncomeToMarketer, deliveryFee, deliveryFee, marketerId
  ];
  return { query, queryArray };
};

const calculateCreatorIncome = ({ creatorId, cashToCreator }) => {
  const creatorIdStr = String(creatorId);
  const query = `
  INSERT INTO creatorIncome (creatorId, creatorTotalIncome, creatorReceivable)
  SELECT
    creatorId,
    IFNULL(MAX(creatorTotalIncome), 0) + ? AS creatorTotalIncome,
    IFNULL(MAX(creatorReceivable), 0) + ? AS creatorReceivable
  FROM creatorIncome AS a WHERE creatorId = ? ORDER BY date DESC LIMIT 1
  `;
  const queryArray = [cashToCreator, cashToCreator, creatorIdStr];

  return { query, queryArray };
};

const insertCampaignLog = ({
  campaignId, creatorId, cashToCreator, salesIncomeToMarketer
}) => {
  const query = `
    INSERT INTO campaignLog
    (campaignId, creatorId, type, cashToCreator, salesIncomeToMarketer)
    VALUES (?, ?, ?, ?, ?)
  `;
  const queryArray = [campaignId, creatorId || '', 'CPS', cashToCreator, salesIncomeToMarketer];
  return { query, queryArray };
};

const updateCalcDoneFlag = ({ orderId }) => {
  const query = 'UPDATE merchandiseOrders SET calculateDoneFlag = ? WHERE id = ?';
  const queryArray = [1, orderId];
  return { query, queryArray };
};

const calculate = async ({
  orderId, campaignId, merchandiseId, orderPrice, calculateDoneFlag,
  marketerId, name, targetCreatorId, statusString, deliveryFee,
  creatorCommission, onadCommission
}) => {
  const connection = await pool.promise().getConnection();

  // 수수료 및 광고 대금 추산
  const { cashToCreator, salesIncomeToMarketer } = getCashesCalculated({
    orderPrice, creatorCommission, onadCommission
  });

  try {
    connection.beginTransaction();
    // * 1. 광고주 판매대금 처리 (marketerSalesIncome)
    const marketerSalesIncome = calculateMarketerSalesIncome({
      marketerId, salesIncomeToMarketer, deliveryFee
    });
    await connection.query(marketerSalesIncome.query, marketerSalesIncome.queryArray);

    // * 2. 방송인 수익금 처리 (creatorIncome)
    const creatorIncome = calculateCreatorIncome({
      creatorId: targetCreatorId, cashToCreator
    });
    await connection.query(creatorIncome.query, creatorIncome.queryArray);

    // * 3. 캠페인 계산 로그 처리 (campaignLog)
    const campaignLog = insertCampaignLog({
      campaignId, creatorId: targetCreatorId, cashToCreator, salesIncomeToMarketer
    });
    await connection.query(campaignLog.query, campaignLog.queryArray);

    // * 4. 모두 완료 후, 주문의 계산완료플래그를 true로 처리 (merchandiseOrders - calculateDoneFlag)
    const doneFlag = updateCalcDoneFlag({ orderId });
    await connection.query(doneFlag.query, doneFlag.queryArray);

    connection.commit();
    console.log(`[${new Date().toLocaleString()}] ${campaignId} 캠페인 (상품: ${name}, 방송인: ${targetCreatorId}) 계산 완료`);
  } catch (e) {
    console.log(`[order: ${orderId}, marketer: ${marketerId}]error occurred during calculate - `, e);
    connection.rollback();
  } finally {
    connection.release();
  }
};

async function liveCommerceCalc() {
  console.info('[liveCommerce] 판매 대금 계산을 시작합니다.');

  const targets = await getTargets().catch((err) => console.error(`[liveCommerce] 계산 대상 목록 가져오는 도중 오류 - ${err}`));
  console.info('[liveCommerce] 판매 대금 계산 타겟 수: ', targets.length);

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
      statusString: target.statusString,
      creatorCommission: target.creatorCommission,
      onadCommission: target.onadCommission,
    }))
  )
    .then(() => console.log(`[${new Date().toLocaleString()}] liveCommerce 판매 대금 계산을 모두 완료하였습니다.`))
    .catch((err) => {
      console.error(`[${new Date().toLocaleString()}] liveCommerce 판매 대금 계산 중 오류 발생`);
      console.error(err);
      return 0;
    });
}

module.exports = liveCommerceCalc;
