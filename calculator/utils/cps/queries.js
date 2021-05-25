
/**
 * 해당 주문의 계산완료 여부를 "완료" 로 변경합니다.
 * @param {object} param0 orderId
 * @returns null | affectedRows
 */
export const getUpdateFlag = ({ orderId }) => {
  const query = 'UPDATE merchandiseOrders SET calculateDoneFlag = ? WHERE id = ?';
  const queryArray = [1, orderId];
  return { query, queryArray };
};


/**
* 계산 로그를 campaignLog에 적재
* @param {object} param0 campaignId, creatorId, cashToCreator, salesIncomeToMarketer
*/
export const getInsertCampaignLog = ({
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


/**
 * 방송인 수익금을 입력합니다. 주문의 리뷰/자랑하기/응원하기 글의 대상으로 크리에이터가 있는 경우에만 실행되어야 합니다.
 * (merchandiseOrderComments 에 있는 지 여부에 따라 진행 여부가 판단됨)
 * @author hwasaurr
 * @param {object} param0 creatorId, cashToCreator
 */
export const getCalculateCreatorIncome = ({ creatorId, cashToCreator }) => {
  if (creatorId && cashToCreator) {
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
  }
  return null;
};


/**
 * 광고주 판매대금을 입력합니다.
 * @author hwasurr
 * @param {object} param0 marketerId, salesIncomeToMarketer
 */
export const getCalculateMarketerSalesIncome = ({
  marketerId, salesIncomeToMarketer, deliveryFee
}) => {
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
    salesIncomeToMarketer, salesIncomeToMarketer, deliveryFee, deliveryFee, marketerId,
  ];
  return { query, queryArray };
};
