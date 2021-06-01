/**
 * 동일 광고주의 판매상품이 여러개인 경우, 수수료 계산 이후, 총 판매 금액으로 합친다.
 * 첫번째이자 마지막 인자인 _feeCalculatedTargets는 다음과 같은 배열입니다.
 * @example
 * const PARAM_feeCalculatedTargets = [
 * {
    id: 16,
    campaignId: 'gubgoo_c35',
    merchandiseId: 43,
    orderPrice: 20000,
    calculateDoneFlag: 0,
    deliveryFee: 3000,
    marketerId: 'gubgoo',
    name: '상품등록테스트2',
    creatorCommission: 0.3,
    onadCommission: 0,
    statusString: '테스트',
    targetList: '{"targetList":["130096343"]}',
    targetCreatorId: '130096343',
    cashToCreator: 6000,
    salesIncomeToMarketer: 14000
  },
  {
    id: 17,
    campaignId: 'gubgoo_c35',
    merchandiseId: 43,
    orderPrice: 40000,
    calculateDoneFlag: 0,
    deliveryFee: 3000,
    marketerId: 'gubgoo',
    name: '상품등록테스트2',
    creatorCommission: 0.3,
    onadCommission: 0,
    statusString: '테스트',
    targetList: '{"targetList":["130096343"]}',
    targetCreatorId: '130096343',
    cashToCreator: 12000,
    salesIncomeToMarketer: 28000
  }
 * ]

  @returns {object}
  @example
  const returndata = [{
    marketerId: 'gubgoo',
    cashToCreators: [ { amount: 18000, creatorId: '130096343' } ],
    salesIncomeToMarketer: 42000,
    deliveryFee: 6000
  }, ...]
 */
const generateOptimizedDataSet = (_feeCalculatedTargets) => {
  const tmp = [];
  _feeCalculatedTargets.forEach((target) => {
    const targetIdx = tmp.findIndex((x) => x.marketerId === target.marketerId);
    if (targetIdx > -1) {
      // tmp 어레이에 동일 광고주의 판매이력이 있는 경우, 합친다.
      const already = tmp[targetIdx];
      if (target.targetCreatorId) { // 수익금이 들어갈 크리에이터가 있는 경우
        const creatorIdx = already.cashToCreators.findIndex(
          (x) => x.creatorId === target.targetCreatorId
        );
        if (creatorIdx > -1) { // 동일 크리에이터의 경우
          const newCreatorObj = already.cashToCreators[creatorIdx];
          newCreatorObj.amount += target.cashToCreator;
          already.cashToCreators[creatorIdx] = newCreatorObj;
        } else {
          already.cashToCreators.push({
            amount: target.cashToCreator,
            creatorId: target.targetCreatorId
          });
        }
      }
      already.salesIncomeToMarketer = target.salesIncomeToMarketer + already.salesIncomeToMarketer;
      already.deliveryFee = target.deliveryFee + already.deliveryFee;
      tmp[targetIdx] = already;
    } else {
      tmp.push({
        marketerId: target.marketerId,
        cashToCreators: target.targetCreatorId
          ? [{
            amount: target.cashToCreator,
            creatorId: target.targetCreatorId
          }]
          : [],
        salesIncomeToMarketer: target.salesIncomeToMarketer,
        deliveryFee: target.deliveryFee,
      });
    }
  });
  return tmp;
};

module.exports = generateOptimizedDataSet;
