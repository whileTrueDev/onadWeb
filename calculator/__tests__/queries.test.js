const {
  getCalculateCreatorIncome,
  getCalculateMarketerSalesIncome,
  getInsertCampaignLog,
  getUpdateFlag,
} = require('../utils/cps/queries');


describe('queries', () => {
  test('getCalculateCreatorIncome', () => {
    const param = {
      creatorId: '130096343',
      cashToCreator: 1000,
    };
    const queryUnit = getCalculateCreatorIncome(param);
    expect(queryUnit.query).toMatch(`
    INSERT INTO creatorIncome (creatorId, creatorTotalIncome, creatorReceivable)
    SELECT
      creatorId,
      IFNULL(MAX(creatorTotalIncome), 0) + ? AS creatorTotalIncome,
      IFNULL(MAX(creatorReceivable), 0) + ? AS creatorReceivable
    FROM creatorIncome AS a WHERE creatorId = ? ORDER BY date DESC LIMIT 1
    `);

    expect(queryUnit.queryArray[0]).toBe(1000);
    expect(queryUnit.queryArray[1]).toBe(1000);
    expect(queryUnit.queryArray[2]).toBe('130096343');
  });

  test('getCalculateMarketerSalesIncome', () => {
    const param = {
      marketerId: 'gubgoo',
      salesIncomeToMarketer: 10000,
      deliveryFee: 3000,
    };
    const queryUnit = getCalculateMarketerSalesIncome(param);

    expect(queryUnit.query).toMatch(`
    INSERT INTO marketerSalesIncome (marketerId, totalIncome, receivable, totalDeliveryFee, receivableDeliveryFee) 
    SELECT
      marketerId,
      IFNULL(MAX(totalIncome), 0) + ? AS totalIncome,
      IFNULL(MAX(receivable), 0) + ? AS receivable,
      IFNULL(MAX(totalDeliveryFee), 0) + ? AS totalDeliveryFee,
      IFNULL(MAX(receivableDeliveryFee), 0) + ? AS receivableDeliveryFee
    FROM marketerSalesIncome AS a WHERE marketerId = ? ORDER BY createDate DESC LIMIT 1`);

    expect(queryUnit.queryArray[0]).toBe(10000);
    expect(queryUnit.queryArray[1]).toBe(10000);
    expect(queryUnit.queryArray[2]).toBe(3000);
    expect(queryUnit.queryArray[3]).toBe(3000);
    expect(queryUnit.queryArray[4]).toBe('gubgoo');
  });

  test('getInsertCampaignLog when creatorId is exists', () => {
    const param = {
      campaignId: 'gubgoo_c42', creatorId: '130096343', cashToCreator: 1000, salesIncomeToMarketer: 4000
    };

    const queryUnit = getInsertCampaignLog(param);
    expect(queryUnit.query).toMatch(`
    INSERT INTO campaignLog
    (campaignId, creatorId, type, cashToCreator, salesIncomeToMarketer)
    VALUES (?, ?, ?, ?, ?)
  `);

    expect(queryUnit.queryArray[0]).toBe('gubgoo_c42');
    expect(queryUnit.queryArray[1]).toBe('130096343');
    expect(queryUnit.queryArray[2]).toBe('CPS');
    expect(queryUnit.queryArray[3]).toBe(1000);
    expect(queryUnit.queryArray[4]).toBe(4000);
  });

  test('getInsertCampaignLog when creatorId is not exists', () => {
    const param = {
      campaignId: 'gubgoo_c42', cashToCreator: 1000, salesIncomeToMarketer: 4000
    };

    const queryUnit = getInsertCampaignLog(param);
    expect(queryUnit.query).toMatch(`
    INSERT INTO campaignLog
    (campaignId, creatorId, type, cashToCreator, salesIncomeToMarketer)
    VALUES (?, ?, ?, ?, ?)
  `);

    expect(queryUnit.queryArray[0]).toBe('gubgoo_c42');
    expect(queryUnit.queryArray[1]).toBe('');
    expect(queryUnit.queryArray[2]).toBe('CPS');
    expect(queryUnit.queryArray[3]).toBe(1000);
    expect(queryUnit.queryArray[4]).toBe(4000);
  });

  test('getUpdateFlag', () => {
    const param = {
      orderId: 32
    };
    const queryUnit = getUpdateFlag(param);
    expect(queryUnit.query).toMatch('UPDATE merchandiseOrders SET calculateDoneFlag = ? WHERE id = ?');

    expect(queryUnit.queryArray[0]).toBe(1);
    expect(queryUnit.queryArray[1]).toBe(32);
  });
});
