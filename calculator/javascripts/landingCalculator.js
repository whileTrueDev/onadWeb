
// landingClickIp 라는 table에서 조회하여 사용한다.
// 랜딩 페이지에서 클릭 시, 여러번 클릭되어 광고 조회, 광고 이동 수가 급격히 증가하는 것을 막기위해
// 아이피당, 지난 한시간동안 클릭한 이력이 없는 경우에만 클릭이 유효하도록 하기 위한 테이블

// contractionId => [ campaignId ]: 해당 클릭된 캠페인의 ID
// creatorId: 크리에이터의 고유 아이디 ( 해당 캠페인의 클릭이 진행된 랜딩페이지의 크리에이터 )
// date: 당시 날짜
// type: 클릭의 타입  (1: 랜딩 페이지 입장, 2: 광고조회 , 3: 광고페이지로 이동 )

// 1. 해당 테이블에서 10분전까지의 클릭한 모든 row를 group by 를 통해 creatorId 별로 구분시킨다.
// 2. creatorId 별로 type을 전부 더하게 되면, 경험치가 되고,
// 3. 특정 값(가격)을 곱하여서 더하게 되면, 그게 더해야할 값이 된다.
const schedule = require('node-schedule');
const logger = require('./calculatorLogger');
const doQuery = require('../model/calculatorQuery');
const Notification = require('./notification');

const COST = 5; // 랜딩페이지의 점수에 비례하여 creator에게 보상을 준다.
const GAUGE = 500;


// 순식간에 creator / campaign 별로 하나씩 계산할 array를 생성한다.
// 해당 exp를 계산하는 이유는 마케터의 금액에서 제하기 위해서.
// 경험지를 위해서는 type이 0인 갯수를 계산하여 경험치로
const getCreatorList = (date) => {
  console.log('10분 전까지의 크리에이터별 경험치 및 수익을 계산합니다.');

  const creatorListQuery = `
  SELECT A.creatorId, A.exp, IFNULL(B.count, 0) as count
  FROM (
  SELECT creatorId, sum(type) as exp
  FROM landingClickIp   
  WHERE date > ?
  GROUP BY creatorId
  ) as A
  LEFT OUTER JOIN 
  (SELECT creatorId,  count(*) as count
  FROM landingClickIp 
  WHERE landingClickIp.type = 0 AND date > ?
  GROUP BY creatorId) as B
  ON A.creatorId = B.creatorId
  `;
  //  SELECT creatorId, sum(type) as exp
  // FROM landingClickIp
  // WHERE date > ?
  // GROUP BY creatorId

  return new Promise((resolve, reject) => {
    doQuery(creatorListQuery, [date, date])
      .then((inrow) => {
        resolve(inrow.result);
      })
      .catch((errorData) => {
        errorData.point = 'getClickList()';
        errorData.description = 'landingClickIp table에서 최신 creatorList 가져오는 과정.';
        reject(errorData);
      });
  });
};

const getCampaignList = (date) => {
  console.log('10분 전까지의 캠페인별(마케터별) 경험치 및 수익을 계산합니다.');

  const campaignListQuery = `
  SELECT li.campaignId, sum(type) as exp, li.creatorId
  FROM landingClickIp as li 
  WHERE date > ? AND NOT type = 0
  GROUP BY li.campaignId, li.creatorId
  `;

  return new Promise((resolve, reject) => {
    doQuery(campaignListQuery, [date])
      .then((inrow) => {
        resolve(inrow.result);
      })
      .catch((errorData) => {
        errorData.point = 'getCampaignList()';
        errorData.description = 'landingClickIp table에서 최신 campaignList 가져오는 과정.';
        reject(errorData);
      });
  });
};

const getMarketerList = (date) => {
  console.log('10분 전까지의 마케터별 광고캐시 소진을 계산합니다.');

  const campaignListQuery = `
  SELECT sum(type) as exp, marketerId
  FROM 
  ( SELECT * 
    FROM landingClickIp  
    WHERE date > ? AND NOT type = 0
  ) as li
  JOIN campaign 
  ON li.campaignId = campaign.campaignId
  GROUP BY marketerId
  `;

  return new Promise((resolve, reject) => {
    doQuery(campaignListQuery, [date])
      .then((inrow) => {
        resolve(inrow.result);
      })
      .catch((errorData) => {
        errorData.point = 'getCampaignList()';
        errorData.description = 'landingClickIp table에서 최신 campaignList 가져오는 과정.';
        reject(errorData);
      });
  });
};

// 하나의 row 즉, 한명의 크리에이터 및 type에 대한 경험치 및 돈 계산.
const creatorIncomeCalcuate = ({ creatorId, exp }) => {
  const searchQuery = `
  SELECT creatorId, creatorTotalIncome, creatorReceivable 
  FROM creatorIncome
  WHERE creatorId = ? 
  ORDER BY date DESC 
  LIMIT 1
  `;

  const calculateQuery = `
  INSERT INTO creatorIncome
  (creatorId, creatorTotalIncome, creatorReceivable) 
  VALUES (?, ?, ?)`;

  if (exp > 0) {
    const price = exp * COST;
    return new Promise((resolve, reject) => {
      console.log(`${creatorId}에 대해 수익 정산을 시작합니다.`);
      doQuery(searchQuery, [creatorId])
        .then((row) => {
          const { creatorTotalIncome, creatorReceivable } = row.result[0];
          doQuery(calculateQuery, [creatorId, creatorTotalIncome + price, creatorReceivable + price])
            .then(() => {
              logger.info(`${price} 원을 ${creatorId} 에게 입금하였습니다`);
              console.log(`${price} 원을 ${creatorId} 에게 입금하였습니다`);
              resolve();
            })
            .catch((errorData) => {
              errorData.point = 'creatorCalcuate()';
              errorData.description = `${price} 원을 ${creatorId} 에게 입금하는 과정.`;
              reject(errorData);
            });
        })
        .catch((errorData) => {
          errorData.point = 'creatorCalcuate()';
          errorData.description = `${creatorId}의 수입을 조회하는 과정.`;
          reject(errorData);
        });
    });
  }
};

const creatorExpCalcuate = ({ creatorId, exp }) => {
  const calculateQuery = `
  UPDATE creatorRoyaltyLevel 
  SET exp = exp + ? 
  WHERE creatorId= ?
  `;

  const levelCalculateQuery = `
  UPDATE creatorRoyaltyLevel 
  SET level = level + 1
  WHERE creatorId= ?
  `;

  const searchQuery = `
  SELECT exp, level 
  FROM creatorRoyaltyLevel
  WHERE creatorId = ?
  `;

  const expCalculateQuery = `
  UPDATE creatorRoyaltyLevel
  SET exp = ?
  WHERE creatorId = ?
  `;


  return new Promise((resolve, reject) => {
    console.log(`${creatorId}에 대해 경험치 정산을 시작합니다.`);
    doQuery(calculateQuery, [exp, creatorId])
      .then((row) => {
        doQuery(searchQuery, [creatorId])
          .then((inrow) => {
            if (parseInt(inrow.result[0].exp / GAUGE) >= 1) {
              Promise.all(
                [
                  Notification(
                    {
                      userType: 'creator',
                      type: 'levelUp',
                      targetId: creatorId,
                      params: {
                        level: inrow.result[0].level + 1
                      }
                    }
                  ),
                  doQuery(expCalculateQuery, [(inrow.result[0].exp % GAUGE), creatorId]),
                  doQuery(levelCalculateQuery, [creatorId])
                ]
              );
            }
          });
        logger.info(`${exp} 만큼 ${creatorId}의 경험치가 올랐습니다.`);
        console.log(`${exp} 만큼 ${creatorId}의 경험치가 올랐습니다.`);
        resolve();
      })
      .catch((errorData) => {
        errorData.point = 'creatorExpCalcuate()';
        errorData.description = `${creatorId}의 경험치를 올리는 과정`;
        reject(errorData);
      });
  });
};

const marketerCalculate = ({ marketerId, exp }) => {
  console.log(`${marketerId}에 대한 정산을 시작합니다.`);

  const calculateQuery = `
  UPDATE marketerDebit 
  SET cashAmount = cashAmount - ? 
  WHERE marketerId = ? `;

  const price = exp * COST * 2;

  return new Promise((resolve, reject) => {
    doQuery(calculateQuery, [price, marketerId])
      .then(() => {
        logger.info(`${price}원을 ${marketerId} 에게서 지급받았습니다.`);
        console.log(`${price}원을 ${marketerId} 에게서 지급받았습니다.`);
        resolve();
      })
      .catch((errorData) => {
        errorData.point = 'marketerCalculate()';
        errorData.description = `${price}원을 ${marketerId} 에게서 지급받는 과정.`;
        reject(errorData);
      });
  });
};

const campaignCalculate = ({ creatorId, campaignId, exp }) => {
  console.log(`계약인 ${campaignId}에 대한 정산을 시작합니다.`);
  const campaignLogQuery = `
    INSERT INTO campaignLog
    (campaignId, creatorId, type, cash) 
    VALUES (?, ?, ?, ?)`;
  const price = exp * COST;
  return new Promise((resolve, reject) => {
    doQuery(campaignLogQuery, [campaignId, creatorId, 'CPC', price])
      .then(() => {
        console.log(`${price} 원을 ${campaignId} 에 등록하였습니다.`);
        logger.info(`${price} 원을 ${campaignId} 에 등록하였습니다.`);
        resolve();
      })
      .catch((errorData) => {
        errorData.point = 'campaignCalculate()';
        errorData.description = `${price} 원을 ${campaignId} 에 등록하는 과정`;
        reject(errorData);
      });
  });
};

async function calculation() {
  console.log('-----------------------------------------------------------');
  console.log(`계산을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);
  const date = new Date();
  // date.setHours(date.getHours() + 9);
  date.setMinutes(date.getMinutes() - 10);

  const [creatorList, marketerList, campaignList] = await Promise.all(
    [
      getCreatorList(date),
      getMarketerList(date),
      getCampaignList(date)
    ]
  );

  Promise.all(
    creatorList.map(({ creatorId, exp, count }) => Promise.all([
      creatorIncomeCalcuate({ creatorId, exp }),
      creatorExpCalcuate({ creatorId, exp: Number(exp) + Number(count) })
    ])),
    marketerList.map(({ marketerId, exp }) => marketerCalculate({ marketerId, exp }))
  )
    .catch((errorData) => {
      console.log('-----------------------------------------------------------');
      console.log(errorData);
      console.log('--------위의 사유로 인하여 에러가 발생하였습니다.-------------');
      logger.error(errorData);
    });

  Promise.all(
    campaignList.map(({ creatorId, campaignId, exp }) => campaignCalculate({ creatorId, campaignId, exp }))
  )
    .catch((errorData) => {
      console.log('-----------------------------------------------------------');
      console.log(errorData);
      console.log('--------위의 사유로 인하여 에러가 발생하였습니다.-------------');
      logger.error(errorData);
    });
}

// calculation();
const scheduler = schedule.scheduleJob('0,10,20,30,40,50 * * * *', () => {
  calculation();
});

module.exports = scheduler;
