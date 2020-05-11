/*
수정 : 2020-05-11

- 어뷰징 방지를 위한 계산 매커니즘 변경
- adpanel, adchat 채널에 의한 creator 정산 금액 수정

*/
// require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.

const doQuery = require('../model/calculatorQuery');
const pool = require('../model/connectionPool');

const CHAT_FEERATE = 0.3;
const PANEL_FEERATE = 0.5;
// 각 action에 따른 cash
const getCreatorCash = ({ payouts, channel }) => {
  switch (channel) {
    case 'adchat':
      return Math.round(payouts * CHAT_FEERATE);
    case 'adpanel':
      return Math.round(payouts * PANEL_FEERATE);
    default:
      return Math.round(payouts * CHAT_FEERATE);
  }
};

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

// 해당 시점에서의 크리에이터별로
const getCreatorList = (date) => {
  const creatorListQuery = `
  SELECT trackingData.*, creatorDetail.peakview
  FROM
  (
  SELECT creatorId, channel, sum(payout) as payouts, count(*) as counts
  FROM tracking 
  WHERE clickedTime > ? AND NOT os IS NULL
  GROUP BY creatorId, channel
  ) AS trackingData
  LEFT JOIN
  creatorDetail
  ON trackingData.creatorId = creatorDetail.creatorId
  `;

  return new Promise((resolve, reject) => {
    doQuery(creatorListQuery, [date])
      .then((inrow) => {
        let creatorNames = [];
        const banList = []; // 계산에서 제외할 creatorList
        const countsList = {};
        const creators = {};

        // 일단 creeator별로 counts를 합산하여 ban dictionary를 만든다.
        inrow.result.forEach(({ creatorId, counts }) => {
          if (creatorNames.includes(creatorId)) {
            // creatorId가 존재할경우,
            countsList[creatorId].counts += counts;
          } else {
            countsList[creatorId] = {
              counts,
            };
            creatorNames.push(creatorId);
          }
        });

        creatorNames = [];

        inrow.result.forEach(({
          creatorId, payouts, channel, peakview
        }) => {
          if (peakview !== null && countsList[creatorId] > peakview) {
            banList.push(creatorId);
          } else {
            const cash = getCreatorCash({ payouts, channel });
            if (creatorNames.includes(creatorId)) {
              // creatorId가 존재할경우,
              creators[creatorId].cash += cash;
            } else {
              creators[creatorId] = {
                cash,
              };
              creatorNames.push(creatorId);
            }
          }
        });

        resolve({ creatorDic: creators, banList });
      })
      .catch((errorData) => {
        console.log(errorData);
        reject(errorData);
      });
  });
};


const getCampaignList = ({ date, banList }) => {
  const campaignListQuery = `
  SELECT campaignId, creatorId, channel, sum(payout) as payouts
  FROM tracking 
  WHERE clickedTime > ? AND NOT os IS NULL
  GROUP BY campaignId, creatorId, channel
  `;

  return new Promise((resolve, reject) => {
    doQuery(campaignListQuery, [date])
      .then((inrow) => {
        const logNames = [];
        const logs = {};
        inrow.result.forEach(({
          campaignId, creatorId, payouts, channel
        }) => {
          if (!banList.includes(creatorId)) {
            const cashToCreator = getCreatorCash({ payouts, channel });
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


const getMarketerList = ({ date, banList }) => {
  const marketerListQuery = `
  SELECT marketerId, creatorId, sum(payout) as payouts
  FROM tracking
  WHERE clickedTime > ? AND NOT os IS NULL
  GROUP BY marketerId, creatorId
  `;

  return new Promise((resolve, reject) => {
    doQuery(marketerListQuery, [date])
      .then((inrow) => {
        const marketerNames = [];
        const marketers = {};
        inrow.result.forEach(({ marketerId, payouts, creatorId }) => {
          if (!banList.includes(creatorId)) {
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
  const date = new Date();
  date.setMinutes(date.getMinutes() - 10);
  // 모든 list가 dic형태로 return 된다.

  const { creatorDic, banList } = await getCreatorList(date);
  const [marketerDic, campaignDic] = await Promise.all([
    getMarketerList({ date, banList }),
    getCampaignList({ date, banList })
  ]);

  Promise.all([
    CampaignConnectionWarp({ campaignDic }),
    CreatorConnectionWarp({ creatorDic }),
    MarketerConnectionWarp({ marketerDic })
  ])
    .then(() => {
      console.log('tracking calculator success');
    });
}

// module.exports = calculation;
calculation();
