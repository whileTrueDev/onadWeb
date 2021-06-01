const generateOptimizedDataSet = require('../utils/cps/generateOptimizedDataSet');

describe('generateOptimizedDataSet.js', () => {
  test('generateOptimizedDataSet when same marketers calc targets are submitted', () => {
    const PARAM_feeCalculatedTargets = [
      {
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
    ];

    const result = generateOptimizedDataSet(PARAM_feeCalculatedTargets);
    expect(result.length).toBe(1);

    expect(result[0].marketerId).toBe('gubgoo');
    result[0].cashToCreators.forEach((c) => {
      expect(c.amount).toBe(18000);
      expect(c.creatorId).toBe('130096343');
    });
    expect(result[0].salesIncomeToMarketer).toBe(42000);
    expect(result[0].deliveryFee).toBe(6000);
  });

  test('generateOptimizedDataSet when different marketers calc targets are submitted', () => {
    const PARAM_feeCalculatedTargets = [
      {
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
        campaignId: 'gstar_c01',
        merchandiseId: 43,
        orderPrice: 40000,
        calculateDoneFlag: 0,
        deliveryFee: 3000,
        marketerId: 'gstar',
        name: '상품등록테스트2',
        creatorCommission: 0.3,
        onadCommission: 0,
        statusString: '테스트',
        targetList: '{"targetList":["123456789"]}',
        targetCreatorId: '123456789',
        cashToCreator: 12000,
        salesIncomeToMarketer: 28000
      }
    ];

    const result = generateOptimizedDataSet(PARAM_feeCalculatedTargets);
    expect(result.length).toBe(2);

    expect(result[0].marketerId).toBe('gubgoo');
    result[0].cashToCreators.forEach((c) => {
      expect(c).toEqual({ amount: 6000, creatorId: '130096343' });
    });
    expect(result[0].salesIncomeToMarketer).toBe(14000);
    expect(result[0].deliveryFee).toBe(3000);

    expect(result[1].marketerId).toBe('gstar');
    result[1].cashToCreators.forEach((c) => {
      expect(c).toEqual({ amount: 12000, creatorId: '123456789' });
    });
    expect(result[1].salesIncomeToMarketer).toBe(28000);
    expect(result[1].deliveryFee).toBe(3000);
  });
});
