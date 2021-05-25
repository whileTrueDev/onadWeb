const { getCashesCalculatedForLiveCommerce, getCashesCalculated } = require('../utils/cps/commission');

describe('commission', () => {
  test('[getCashesCalculatedForLiveCommerce] 10000 price, 0.3commission to creator, 0commission to onad', () => {
    const param = {
      orderPrice: 10000, creatorCommission: 0.3, onadCommission: 0
    };
    const {
      cashToCreator, salesIncomeToMarketer
    } = getCashesCalculatedForLiveCommerce(param);

    expect(cashToCreator).toBe(3000);
    expect(salesIncomeToMarketer).toBe(7000);
  });

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
});
