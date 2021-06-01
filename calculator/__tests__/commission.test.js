const { getCashesCalculated, getFeeCalculatedTargets } = require('../utils/cps/commission');

describe('commission', () => {
  test('[getCashesCalculated] when creator is exists', () => {
    const param = {
      totalOrderPrice: 10000,
      isCreatorExists: true,
      creatorCommission: 0.1,
      onadCommission: 0.1,
    };
    const {
      cashToCreator, salesIncomeToMarketer
    } = getCashesCalculated(param);

    expect(cashToCreator).toBe(1000);
    expect(salesIncomeToMarketer).toBe(8000);
  });

  test('[getCashesCalculated] when creator is not exists', () => {
    const param = {
      totalOrderPrice: 10000,
      isCreatorExists: false,
      creatorCommission: 0.1,
      onadCommission: 0.1,
    };
    const {
      cashToCreator, salesIncomeToMarketer
    } = getCashesCalculated(param);

    expect(cashToCreator).toBe(0);
    expect(salesIncomeToMarketer).toBe(9000);
  });

  test('[getFeeCalculatedTargets]', () => {
    const param = [
      {
        orderPrice: 10000, targetCreatorId: '130096343', creatorCommission: 0.3, onadCommission: 0, marketerId: 'gubgoo'
      },
      {
        orderPrice: 20000, targetCreatorId: '130096343', creatorCommission: 0.1, onadCommission: 0.1, marketerId: 'gubgoo'
      },
      {
        orderPrice: 10000, targetCreatorId: '123456789', creatorCommission: 0.1, onadCommission: 0.1, marketerId: 'gstar'
      },
    ];
    // eslint-disable-next-line max-len
    // salesIncomeToMarketer = orderPrice - Math.round(orderPrice * creatorCommission) - Math.round(orderPrice * onadCommission)
    // cashToCreator = Math.round(orderPrice * creatorCommission)
    const testResultData = [
      { cashToCreator: 3000, salesIncomeToMarketer: 7000 },
      { cashToCreator: 2000, salesIncomeToMarketer: 16000 },
      { cashToCreator: 1000, salesIncomeToMarketer: 8000 },
    ];
    const result = getFeeCalculatedTargets(param);
    result.forEach((r, i) => {
      expect(r.orderPrice).toBe(param[i].orderPrice);
      expect(r.targetCreatorId).toBe(param[i].targetCreatorId);
      expect(r.creatorCommission).toBe(param[i].creatorCommission);
      expect(r.onadCommission).toBe(param[i].onadCommission);
      expect(r.marketerId).toBe(param[i].marketerId);

      expect(r.salesIncomeToMarketer).toBe(testResultData[i].salesIncomeToMarketer);
      expect(r.cashToCreator).toBe(testResultData[i].cashToCreator);
    });
  });
});
