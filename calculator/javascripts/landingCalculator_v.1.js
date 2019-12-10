/*
수정 : 2019-12-10
작성자 : 박찬우

수정내용:

- COST에 대한 세분화 및 connection 재사용 wrapping

*/
const schedule = require('node-schedule');
const doQuery = require('../model/calculatorQuery');
const Notification = require('./notification');
const pool = require('../model/connectionPool');

// COST 세분화를 하자.
// const COST_TYPE_0 = 0;
const COST_TYPE_1 = 5; // 랜딩페이지의 점수에 비례하여 creator에게 보상을 준다.
const COST_TYPE_2 = 100;

const GAUGE = 500;
const FEERATE = 0.6;

// 각 type에 따른 수 만큼, type이 0일 때는 의미가 없으므로
const getCreatorCash = ({ count, type }) => {
  switch (type) {
    case 1:
      return Math.round(count * COST_TYPE_1 * FEERATE);
    case 2:
      return Math.round(count * COST_TYPE_2 * FEERATE);
    default:
      return 0;
  }
};

const getCreatorExp = ({ count, type }) => {
  switch (type) {
    case 0:
      return count;
    case 1:
      return count * 2;
    case 2:
      return count * 3;
    default:
      return 0;
  }
};

const getMarketerCash = ({ count, type }) => {
  switch (type) {
    case 1:
      return Math.round(count * COST_TYPE_1);
    case 2:
      return Math.round(count * COST_TYPE_2);
    default:
      return 0;
  }
};

// 크리에이터
const getCreatorList = (date) => {
  const creatorListQuery = `
  SELECT creatorId,  count(type) as count, type
  FROM landingClickIp 
  WHERE date > ?
  GROUP BY creatorId, type
  `;

  return new Promise((resolve, reject) => {
    doQuery(creatorListQuery, [date])
      .then((inrow) => {
        // creatorNames는 creatorId의 중복성을 체크하기 위한 array
        // creators는 type에 따라 계산된 금액의 총합이 들어간 dictionary
        const creatorNames = [];
        const creators = {};
        inrow.result.forEach(({ creatorId, count, type }) => {
          const cash = getCreatorCash({ count, type });
          const exp = getCreatorExp({ count, type });
          if (creatorNames.includes(creatorId)) {
            // creatorId가 존재할경우,
            creators[creatorId].cash += cash;
            creators[creatorId].exp += exp;
          } else {
            creators[creatorId] = {
              cash,
              exp
            };
            creatorNames.push(creatorId);
          }
        });
        resolve(creators);
      })
      .catch((errorData) => {
        console.log(errorData);
        errorData.point = 'getClickList()';
        errorData.description = 'landingClickIp table에서 최신 creatorList 가져오는 과정.';
        reject(errorData);
      });
  });
};

// cashTocreator  + cashFromMarketer를 모두 계산해야한다.
// campaignLog를 찍기 위해서는 둘다 필요하다.
const getCampaignList = (date) => {
  const campaignListQuery = `
  SELECT campaignId, creatorId, count(type) as count, type
  FROM landingClickIp 
  WHERE date > ? AND NOT type = 0
  GROUP BY campaignId, creatorId, type
  `;

  return new Promise((resolve, reject) => {
    doQuery(campaignListQuery, [date])
      .then((inrow) => {
        const logNames = [];
        const logs = {};
        inrow.result.forEach(({
          campaignId, creatorId, count, type
        }) => {
          const cashToCreator = getCreatorCash({ count, type });
          const cashFromMarketer = getMarketerCash({ count, type });
          const logId = `${campaignId}/${creatorId}`;
          if (logNames.includes(logId)) {
            // creatorId가 존재할경우,
            logs[logId].cashToCreator += cashToCreator;
            logs[logId].cashFromMarketer += cashFromMarketer;
          } else {
            logs[logId] = {
              cashToCreator,
              cashFromMarketer
            };
            logNames.push(logId);
          }
        });
        resolve(logs);
      })
      .catch((errorData) => {
        errorData.point = 'getCampaignList()';
        errorData.description = 'landingClickIp table에서 최신 campaignList 가져오는 과정.';
        reject(errorData);
      });
  });
};


const getMarketerList = (date) => {
  const marketerListQuery = `
  SELECT count(type) as count, marketerId, type
  FROM
  ( SELECT *
   FROM landingClickIp
   WHERE date > ? AND NOT type = 0
  ) as li
  JOIN campaign
  ON li.campaignId = campaign.campaignId
  GROUP BY marketerId, type
  `;

  return new Promise((resolve, reject) => {
    doQuery(marketerListQuery, [date])
      .then((inrow) => {
        // resolve(inrow.result);
        const marketerNames = [];
        const marketers = {};
        inrow.result.forEach(({ marketerId, count, type }) => {
          const cash = getMarketerCash({ count, type });
          if (cash === 0) {
            return;
          }
          if (marketerNames.includes(marketerId)) {
            // creatorId가 존재할경우,
            marketers[marketerId] += cash;
          } else {
            marketers[marketerId] = cash;
            marketerNames.push(marketerId);
          }
        });
        resolve(marketers);
      })
      .catch((errorData) => {
        errorData.point = 'getCampaignList()';
        errorData.description = 'landingClickIp table에서 최신 campaignList 가져오는 과정.';
        reject(errorData);
      });
  });
};

const doTransacQuery = ({ connection, queryState, params }) => new Promise((resolve, reject) => {
  connection.beginTransaction((err) => {
    if (err) {
      console.log('doTransacQuery err');
      console.log(err);
      reject(err);
    }
    connection.query(queryState, params, (err1, result) => {
      if (err1) {
        console.log('doTransacQuery err1');
        console.log(err1);
        connection.rollback(() => {
          reject(err1);
        });
      } else {
        connection.commit((err2) => {
          if (err2) {
            console.log('doTransacQuery err2');
            console.log(err2);
            connection.rollback(() => {
              reject(err2);
            });
          } else {
            resolve();
          }
        });
      }
    });
  });
});

// select문 실행 후, 해당 결과 값을 가지고 더하여 트랜잭션 진행.
const doTransacCreatorQuery = ({
  connection, params
}) => new Promise((resolve, reject) => {
  // select query 실행 영역.
  const searchQuery = `
  SELECT creatorId, creatorTotalIncome, creatorReceivable 
  FROM creatorIncome
  WHERE creatorId = ? 
  ORDER BY date DESC 
  LIMIT 1
  `;

  const creatorCalculateQuery = `
  INSERT INTO creatorIncome
  (creatorId, creatorTotalIncome, creatorReceivable) 
  VALUES (?, ?, ?)`;

  const { creatorId, cash } = params;

  connection.query(searchQuery, [creatorId], (err2, result) => {
    if (err2) {
      console.log('doTransacCreatorQuery > selectQuery > err2');
      console.log(err2);
      reject(err2);
    } else {
      const { creatorTotalIncome, creatorReceivable } = result[0];
      // write를 진행하기 위해서 transaction을 생성한다.
      if (cash === 0) {
        resolve();
      } else {
        doTransacQuery({ connection, queryState: creatorCalculateQuery, params: [creatorId, creatorTotalIncome + cash, creatorReceivable + cash] })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      }
    }
  });
});


const doTransacMarketerQuery = ({
  connection, params
}) => new Promise((resolve, reject) => {
  // select query 실행 영역.
  const selectQuery = `
  SELECT cashAmount
  FROM marketerDebit
  WHERE marketerId = ?
  `;

  const calculateQuery = `
  UPDATE marketerDebit 
  SET cashAmount = cashAmount - ? 
  WHERE marketerId = ? `;

  const { marketerId, cash } = params;

  connection.query(selectQuery, [marketerId], (err2, result) => {
    if (err2) {
      console.log('doTransacCreatorQuery > selectQuery > err2');
      console.log(err2);
      reject(err2);
    } else {
      const { cashAmount } = result[0];
      // write를 진행하기 위해서 transaction을 생성한다.
      if (cash >= cashAmount) {
        console.log(`잔액이 부족하므로 ${cash}만큼 받지 못했습니다.`);
        resolve();
      } else {
        doTransacQuery({ connection, queryState: calculateQuery, params: [cash, marketerId] })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      }
    }
  });
});

const CreatorConnectionWarp = ({ creatorDic }) => new Promise((resolve, reject) => {
  // 커넥션을 하나 받는다.
  pool.getConnection((err, connection) => {
    if (err) {
      reject(err);
    } else {
      Promise.all(
        Object.keys(creatorDic).map((creatorId) => {
          const { cash, exp } = creatorDic[creatorId];
          return doTransacCreatorQuery({ connection, params: { creatorId, cash, exp } });
        })
      )
        .then(() => {
          connection.release();
          resolve();
        })
        .catch((errorData) => {
          connection.release();
          reject(errorData);
        });
    }
  });
});

// 캠페인 로그를 저장하는 Promise를 하나의 connection으로 wrapping한다.
const CampaignConnectionWarp = ({ campaignDic }) => new Promise((resolve, reject) => {
  // 커넥션을 하나 받는다.
  const campaignLogQuery = `
  INSERT INTO campaignLog
  (campaignId, creatorId, type, cashFromMarketer, cashToCreator) 
  VALUES (?, ?, ?, ?, ?)`;
  pool.getConnection((err, connection) => {
    if (err) {
      reject(err);
    } else {
      Promise.all(
        Object.keys(campaignDic).map((logId) => {
          const [campaignId, creatorId] = logId.split('/');
          const { cashFromMarketer, cashToCreator } = campaignDic[logId];
          return doTransacQuery({ connection, queryState: campaignLogQuery, params: [campaignId, creatorId, 'CPC', cashFromMarketer, cashToCreator] });
        })
      )
        .then(() => {
          connection.release();
          resolve();
        })
        .catch((errorData) => {
          connection.release();
          reject(errorData);
        });
    }
  });
});

const MarketerConnectionWarp = ({ marketerDic }) => new Promise((resolve, reject) => {
  // 커넥션을 하나 받는다.
  pool.getConnection((err, connection) => {
    if (err) {
      reject(err);
    } else {
      Promise.all(
        Object.keys(marketerDic).map((marketerId) => {
          const cash = marketerDic[marketerId];
          return doTransacMarketerQuery({ connection, params: { marketerId, cash } });
        })
      )
        .then(() => {
          connection.release();
          resolve();
        })
        .catch((errorData) => {
          connection.release();
          reject(errorData);
        });
    }
  });
});


const doTransacExpQuery = ({
  connection, params
}) => new Promise((resolve, reject) => {
  // select query 실행 영역.
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
  const { creatorId, exp } = params;

  doTransacQuery({ connection, queryState: calculateQuery, params: [exp, creatorId] })
    .then(() => {
      connection.query(searchQuery, [creatorId], (err, result) => {
        if (err) {
          console.log('doTransacExpQuery > selectQuery > err');
          console.log(err);
          reject(err);
        } else if (parseInt(result[0].exp / GAUGE) >= 1) {
          Promise.all(
            [
              Notification(
                {
                  userType: 'creator',
                  type: 'levelUp',
                  targetId: creatorId,
                  params: {
                    level: result[0].level + 1
                  }
                }
              ),
              doTransacQuery({ connection, queryState: expCalculateQuery, params: [(result[0].exp % GAUGE), creatorId] }),
              doTransacQuery({ connection, queryState: levelCalculateQuery, params: [creatorId] })
            ]
          ).then(() => {
            resolve();
          })
            .catch((err1) => {
              console.log('doTransacExpQuery > doTransacQuery > err1');
              console.log(err1);
              reject();
            });
        } else {
          resolve();
        }
      });
    })
    .catch(() => {
      reject();
    });
});

const ExpConnectionWarp = ({ creatorDic }) => new Promise((resolve, reject) => {
  // 커넥션을 하나 받는다.
  pool.getConnection((err, connection) => {
    if (err) {
      reject(err);
    } else {
      Promise.all(
        Object.keys(creatorDic).map((creatorId) => {
          const { exp } = creatorDic[creatorId];
          return doTransacExpQuery({ connection, params: { creatorId, exp } });
        })
      )
        .then(() => {
          connection.release();
          resolve();
        })
        .catch((errorData) => {
          connection.release();
          reject(errorData);
        });
    }
  });
});

async function calculation() {
  console.log('-----------------------------------------------------------');
  console.log(`계산을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);
  const date = new Date();
  date.setMinutes(date.getMinutes() - 10);

  // 모든 list가 dic형태로 return 된다.
  const [creatorDic, marketerDic, campaignDic] = await Promise.all([
    getCreatorList(date),
    getMarketerList(date),
    getCampaignList(date)
  ]);

  Promise.all([
    CampaignConnectionWarp({ campaignDic }),
    CreatorConnectionWarp({ creatorDic }),
    MarketerConnectionWarp({ marketerDic })
  ])
    .then(ExpConnectionWarp({ creatorDic }))
    .then(() => {
      console.log(`계산을 종료합니다. 시작 시각 : ${new Date().toLocaleString()}`);
      console.log('-----------------------------------------------------------');
    });
}

const scheduler = schedule.scheduleJob('0,10,20,30,40,50 * * * *', () => {
  calculation();
});

module.exports = scheduler;
