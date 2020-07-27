/*
수정 : 2020-05-11

- 어뷰징 방지를 위한 계산 매커니즘 변경
- adpanel, adchat 채널에 의한 creator 정산 금액 수정

*/
// require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.

const doQuery = require('../model/calculatorQuery');
const { doTransacQuery } = require('../model/doQuery');

const pool = require('../model/connectionPool');

const CHAT_FEERATE = 0.3;
const PANEL_FEERATE = 0.5;
const PAGE_FEERATE = 0.8;


// 각 action에 따른 cash
const getCreatorCash = ({ payouts, channel }) => {
  switch (channel) {
    case 'adchat':
      return Math.round(payouts * CHAT_FEERATE);
    case 'adpanel':
      return Math.round(payouts * PANEL_FEERATE);
    case 'adpage':
      return Math.round(payouts * PAGE_FEERATE);
    default:
      return Math.round(payouts * CHAT_FEERATE);
  }
};

// 0으로 고쳐둠.
const getMarketerCash = ({ payouts }) => Math.round(payouts);

// 해당 시점에서의 크리에이터별로 CPA에 대한 금액도 추가되었다.
const getCreatorList = (date) => {
  const creatorListQuery = `
  SELECT trackingData.*, creatorDetail.peakview
  FROM
  (
  SELECT creatorId, channel, sum(payout) as payouts, count(*) as counts
  FROM tracking 
  WHERE (clickedTime > ? AND costType = 'CPC' AND NOT os IS NULL)
  OR (createdAt > ? AND costType = 'CPA' AND NOT os IS NULL)
  GROUP BY creatorId, channel
  ) AS trackingData
  LEFT JOIN
  creatorDetail
  ON trackingData.creatorId = creatorDetail.creatorId
  `;
  return new Promise((resolve, reject) => {
    doQuery(creatorListQuery, [date, date])
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
          if ((peakview !== null && countsList[creatorId] > peakview) || creatorId == null ) {
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


// 캠페인 아이디에 따라서 costType이 다를 수 있으나 현재는 CPC + CPA 상품이 존재하지 않기 때문에 가능하다.
const getCampaignList = ({ date, banList }) => {
  const campaignListQuery = `
  SELECT campaignId, creatorId, channel, sum(payout) as payouts, costType
  FROM tracking 
  WHERE (clickedTime > ? AND costType = 'CPC' AND NOT os IS NULL)
  OR (createdAt > ? AND costType = 'CPA' AND NOT os IS NULL)
  GROUP BY campaignId, creatorId, channel
  `;
  return new Promise((resolve, reject) => {
    doQuery(campaignListQuery, [date, date])
      .then((inrow) => {
        const logNames = [];
        const logs = {};
        inrow.result.forEach(({
          campaignId, creatorId, payouts, channel, costType
        }) => {
          if (!banList.includes(creatorId)) {
            const cashToCreator = (creatorId == null) ? 0 : getCreatorCash({ payouts, channel });
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
                costType
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
  WHERE clickedTime > ? AND costType = 'CPC' AND NOT os IS NULL
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
          const { cashFromMarketer, cashToCreator, costType } = campaignDic[logId];
          return doTransacQuery({ connection, queryState: campaignLogQuery, params: [campaignId, creatorId, costType, cashFromMarketer, cashToCreator] });
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

const calculationPromise = async () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - 10);
  // 모든 list가 dic형태로 return 된다.
  console.log(`CPC 계산을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);

  const { creatorDic, banList } = await getCreatorList(date);
  const [marketerDic, campaignDic] = await Promise.all([
    getMarketerList({ date, banList }),
    getCampaignList({ date, banList })
  ]);

  return new Promise((resolve, reject) => {
    Promise.all([
      CampaignConnectionWarp({ campaignDic }),
      CreatorConnectionWarp({ creatorDic }),
      MarketerConnectionWarp({ marketerDic })
    ])
      .then(() => {
        console.log(`CPC 계산을 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
        resolve();
      })
      .catch((error) => {
        console.log('-----------------------------------------------------------');
        console.log(error);
        console.log('--------위의 사유로 인하여 에러가 발생하였습니다.-------------');
        resolve();
      });
  });
};


module.exports = calculationPromise;
