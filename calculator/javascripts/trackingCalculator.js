/*
수정 : 2020-04-02
작성자 : 박찬우 (궁금한 것은 문의 하세요.)

구현 내용:

CPC 계산프로그램과 동일하게 checkTime을 탐지하여 10분마다 계산을 실시한다.
campaignLog action을 CPC로 정의하여 Insert 한다.

* CPC만 하는 캠페인이 존재하지 않으므로 CPM을 계산하는 타이밍에 잔액이 존재하는지 안하는지 체크하도록 둔다.
- campaign계산: 사용된 돈과 크리에이터에게 줄 돈을 계산하여 campaignLog를 찍는다.
- marketer계산: marketerDebit에서 사용된 돈을 제한다.
- creator계산: creatorIncome에 찍는다.

확장성을 고려하여 action의 종류를 고려한다.
*/

const schedule = require('node-schedule');
const doQuery = require('../model/calculatorQuery');
const pool = require('../model/connectionPool');

const FEERATE = 0.6;

// 각 action에 따른 cash
const getCreatorCash = ({ payouts }) => Math.round(payouts * FEERATE);
const getMarketerCash = ({ payouts }) => Math.round(payouts);


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


const getCreatorList = (date) => {
  const creatorListQuery = `
  SELECT creatorId, sum(payout) as payouts
  FROM tracking 
  WHERE clickedTime > ? AND NOT os IS NULL
  GROUP BY creatorId
  `;

  return new Promise((resolve, reject) => {
    doQuery(creatorListQuery, [date])
      .then((inrow) => {
        const creatorNames = [];
        const creators = {};
        inrow.result.forEach(({ creatorId, payouts }) => {
          const cash = getCreatorCash({ payouts });
          if (creatorNames.includes(creatorId)) {
            // creatorId가 존재할경우,
            creators[creatorId].cash += cash;
          } else {
            creators[creatorId] = {
              cash,
            };
            creatorNames.push(creatorId);
          }
        });
        resolve(creators);
      })
      .catch((errorData) => {
        console.log(errorData);
        reject(errorData);
      });
  });
};

const getCampaignList = (date) => {
  const campaignListQuery = `
  SELECT campaignId, creatorId, sum(payout) as payouts
  FROM tracking 
  WHERE clickedTime > ? AND NOT os IS NULL
  GROUP BY campaignId, creatorId
  `;

  return new Promise((resolve, reject) => {
    doQuery(campaignListQuery, [date])
      .then((inrow) => {
        const logNames = [];
        const logs = {};
        inrow.result.forEach(({
          campaignId, creatorId, payouts
        }) => {
          const cashToCreator = getCreatorCash({ payouts });
          const cashFromMarketer = getMarketerCash({ payouts });
          const logId = `${campaignId}/${creatorId}`;
          if (logNames.includes(logId)) {
            // creatorId가 존재할경우,
            logs[logId].cashToCreator += cashToCreator;
            logs[logId].cashFromMarketer += cashFromMarketer;
          } else {
            logs[logId] = {
              cashToCreator,
              cashFromMarketer,
            };
            logNames.push(logId);
          }
        });
        resolve(logs);
      })
      .catch((errorData) => {
        console.log(errorData);
        reject(errorData);
      });
  });
};


const getMarketerList = (date) => {
  const marketerListQuery = `
  SELECT marketerId, sum(payout) as payouts
  FROM tracking
  WHERE clickedTime > ? AND NOT os IS NULL
  GROUP BY marketerId
  `;

  return new Promise((resolve, reject) => {
    doQuery(marketerListQuery, [date])
      .then((inrow) => {
        const marketerNames = [];
        const marketers = {};
        inrow.result.forEach(({ marketerId, payouts }) => {
          const cash = getMarketerCash({ payouts });
          if (cash === 0) {
            return;
          }
          if (marketerNames.includes(marketerId)) {
            marketers[marketerId] += cash;
          } else {
            marketers[marketerId] = cash;
            marketerNames.push(marketerId);
          }
        });
        resolve(marketers);
      })
      .catch((errorData) => {
        console.log(errorData);
        reject(errorData);
      });
  });
};


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
      console.log('doTransacMarketerQuery > selectQuery > err2');
      console.log(err2);
      reject(err2);
    } else {
      const { cashAmount } = result[0];
      // write를 진행하기 위해서 transaction을 생성한다.
      if (cash === 0) {
        resolve();
      } else if (cash >= cashAmount) {
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
          const { cash } = creatorDic[creatorId];
          return doTransacCreatorQuery({ connection, params: { creatorId, cash } });
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


async function calculation() {
  console.log('-----------------------------------------------------------');
  console.log(`tracking server 계산을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);
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
    .then(() => {
      console.log(`tracking server 계산을 종료합니다. 시작 시각 : ${new Date().toLocaleString()}`);
      console.log('-----------------------------------------------------------');
    });
}

const scheduler = schedule.scheduleJob('0,10,20,30,40,50 * * * *', () => {
  calculation();
});

module.exports = scheduler;
