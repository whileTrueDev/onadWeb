const Notification = require('./notification');
const pool = require('../model/connectionPool');
const sendAlimtalk = require('./alimtalk');
const { doConnectionQuery, doTransacQuery } = require('../model/doQuery');
// 시청자수 1회당 가격
const PPP = 2;
// const FEERATE = 0.5;

// 추석 이벤트 가격 수정
const FEERATE = 1;


// 현재시간은 5분, crawler가 활동하는 시기는 0분 타이밍이므로 10분을 깎아서
const getcreatorList = ({ date }) => {
  const streamerListQuery = `
  SELECT B.streamerId
  FROM (SELECT * FROM twitchStreamDetail WHERE time > ?) AS A
  LEFT JOIN twitchStream AS B
  ON A.streamId = B.streamId `;

  const bannerListQuery = `
  SELECT RT.creatorId, RT.campaignId
  FROM
  (SELECT CT.creatorId, campaignId
  FROM 
  (
  SELECT creatorId, campaignId
  FROM campaignTimestamp
  WHERE date > ?
  ) AS CT
  LEFT JOIN
  creatorInfo
  ON CT.creatorId = creatorInfo.creatorId
  WHERE creatorInfo.arrested = 0
  ) AS RT
  LEFT JOIN
  campaign
  ON RT.campaignId = campaign.campaignId
  WHERE NOT campaign.limitState = 1
  GROUP BY creatorId`;

  // 제약조건 추가. 계산하는 시간 내 OFF 버튼 존재시 그냥 해당 시점 밴
  const offListQuery = `
  select creatorId
  from (
  select advertiseUrl
  from bannerVisible
  where date > ?
  and type = 1
  and visibleState = 0
  ) as URL
  left join creatorInfo
  on URL.advertiseUrl = creatorInfo.advertiseUrl
  group by creatorId
  `;

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log('getcreatorList 의 오류: 현재 방송 중이며, 배너를 게시하고 있는 creator 구하는 과정');
        reject(err);
      } else {
        Promise.all([
          doConnectionQuery({ connection, queryState: bannerListQuery, params: [date] }),
          doConnectionQuery({ connection, queryState: streamerListQuery, params: [date] }),
          doConnectionQuery({ connection, queryState: offListQuery, params: [date] }),
        ])
          .then(([bannerListData, streamerListData, offListData]) => {
            // 실제 현재 방송 중인 크리에이터이다.
            const offList = offListData.map((offData) => offData.creatorId);
            const streamers = streamerListData.map((streamerData) => streamerData.streamerId);
            const uniqueStreamers = Array.from(new Set(streamers));
            const creators = bannerListData.reduce((result, bannerData) => {
              // offList에 존재하지 않을 경우에만 계산항목으로 들어가도록 추가.
              if (uniqueStreamers.includes(bannerData.creatorId) && !offList.includes(bannerData.creatorId)) {
                result.push(bannerData);
              }
              return result;
            }, []);
            connection.release();
            resolve(creators);
          })
          .catch((errorData) => {
            errorData.point = 'getCreatorList()';
            errorData.description = '현재 방송 중이며, 배너를 게시하고 있는 creator 구하는 과정';
            connection.release();
            reject(errorData);
          });
      }
    });
  });
};

// 전달하는 creatorId를 통해 현재
const getviewer = ({
  connection, creatorId
}) => {
  // 9시간을 제한 값을 통해 streamId를 들고올 수 있다.
  const streamIdQuery = `
  SELECT streamId
  FROM twitchStream 
  WHERE streamerId = ? 
  ORDER BY startedAt DESC
  LIMIT 1 
  `;

  const viewerQuery = ` 
  SELECT viewer
  FROM twitchStreamDetail 
  WHERE streamId = ? 
  ORDER BY time DESC 
  LIMIT 1`;

  // 함수의 인자로 커넥션을 하나 받는다.
  // query를 사용하여 값을 가져오는 것이기 때문에 Promise 객체를 생성하여 wrapping 한다.
  // transction을 하는 이유는 쓰기에 대한 오류를 범하지 않기 위해서이므로 읽기에는 사용하지 않는다.
  return new Promise((resolve, reject) => {
    connection.query(streamIdQuery, [creatorId], (err1, result) => {
      if (err1) {
        reject(err1);
      }
      const { streamId } = result[0];
      connection.query(viewerQuery, [streamId], (err2, result1) => {
        if (err2) {
          reject(err2);
        }
        // stamp에 찍혀있더라도 존재하지 않는 경우가 존재한다.
        if (result1.length !== 0) {
          const { viewer } = result1[0];
          resolve(viewer);
        } else {
          resolve(0);
        }
      });
    });
  });
};

const getprice = ({
  connection, campaignId
}) => {
  const marketerPriceQuery = `
  SELECT md.unitPrice
  FROM campaign
  LEFT JOIN marketerDebit AS md
  ON campaign.marketerId = md.marketerId
  WHERE campaign.campaignId = ?
  `;

  // 함수의 인자로 커넥션을 하나 받는다.
  // query를 사용하여 값을 가져오는 것이기 때문에 Promise 객체를 생성하여 wrapping 한다.
  // transction을 하는 이유는 쓰기에 대한 오류를 범하지 않기 위해서이므로 읽기에는 사용하지 않는다.
  return new Promise((resolve, reject) => {
    connection.query(marketerPriceQuery, [campaignId], (err1, result) => {
      if (err1) {
        reject(err1);
      }
      if (result.length !== 0) {
        const { unitPrice } = result[0];
        resolve(Number(unitPrice));
      } else {
        resolve(0);
      }
    });
  });
};

// 수수료 계산 및 marketer / creator 돈 분할 계산 영역
const getStreamList = ({
  connection, creatorList
}) => Promise.all(
  creatorList.map(async ({ creatorId, campaignId }) => {
    const streamData = {
      creatorId,
      campaignId,
      viewer: 0
    };
    // 시청자 수 가져오기.
    const viewer = await getviewer({
      connection, creatorId
    });

    if (viewer === 0) {
      return {};
    }

    // 마케터의 unitprice를 가져온다.
    const unitPrice = await getprice({
      connection, campaignId
    });

    streamData.viewer = viewer || 0;

    // 마케터에게서 징수하는 금액은 PPP(노출 1회당 가격) X viewer(10분동안의 노출량) X unitPrice(마케터 고유의 가격)
    streamData.cashFromMarketer = Math.round(Number(viewer) * Number(unitPrice) * PPP);

    // 크리에이터에게 전달되는 금액은 PPP(노출 1회당 가격) X viewer(10분동안의 노출량) X unitPrice(마케터 고유의 가격) X FEERATE(세율)
    streamData.cashToCreator = Math.round(Math.round(Number(viewer) * Number(unitPrice) * PPP) * FEERATE);

    return streamData;
  })
);

// 커넥션으로 warpping한다.
// func, params로 나뉘어 전달받아 커넥션을 전달함.
// func : 커넥션을 반환 받아 쿼리문을 수행할 함수
// params : func에 사용될 dic형태의 parameter
const connectionWarp = ({ func, params }) => new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) {
      reject(err);
    }
    func({
      connection, ...params
    }).then((result) => {
      resolve(result);
      connection.release();
      // 이제 계산이 들어가야한다.
    })
      .catch((errorData) => {
        connection.release();
        reject(errorData);
      });
  });
});

const creatorCalculate = ({ connection, price, creatorId }) => {
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

  return new Promise((resolve, reject) => {
    connection.query(searchQuery, [creatorId], (err1, result) => {
      if (err1) {
        reject(err1);
      }
      const { creatorTotalIncome, creatorReceivable } = result[0];
      connection.beginTransaction((err) => {
        if (err) {
          console.log('creatorCalculate err');
          console.log(err);
          reject(err);
        }
        connection.query(calculateQuery, [creatorId, creatorTotalIncome + price, creatorReceivable + price], (err2, result1) => {
          if (err2) {
            connection.rollback(() => {
              console.log('creatorCalculate err2');
              console.log(err2);
              reject(err2);
            });
          } else {
            connection.commit((err3) => {
              if (err3) {
                console.log('creatorCalculate err3');
                console.log(err3);
                connection.rollback(() => {
                  reject(err3);
                });
              } else {
                resolve();
              }
            });
          }
        });
      });
    });
  });
};

const marketerCalculate = ({ connection, campaignId, price }) => {
  const marketerId = campaignId.split('_')[0];
  const queryState = `
  UPDATE marketerDebit 
  SET cashAmount = cashAmount - ? 
  WHERE marketerId = ? `;
  return doTransacQuery({ connection, queryState, params: [price, marketerId] });
};

const campaignCalculate = ({
  connection, creatorId, campaignId, cashFromMarketer, cashToCreator, viewer
}) => {
  const queryState = `
    INSERT INTO campaignLog
    (campaignId, creatorId, type, cashFromMarketer, cashToCreator, viewer) 
    VALUES (?, ?, ?, ?, ?, ?)`;
  return doTransacQuery({ connection, queryState, params: [campaignId, creatorId, 'CPM', cashFromMarketer, cashToCreator, viewer] });
};

const marketerZeroCalculate = ({ connection, marketerId }) => {
  const marketerDebitQuery = `
  SELECT cashAmount, warning
  FROM marketerDebit 
  WHERE marketerId = ? `;

  const emptyQuery = `
  UPDATE marketerDebit 
  SET cashAmount = 0 
  WHERE marketerId = ? `;

  const campaignSetQuery = `
  UPDATE campaign 
  SET onOff = 0  
  WHERE SUBSTRING_INDEX(campaignId, '_' , 1) = ?
  `;

  const marketerSetQuery = `
  UPDATE marketerInfo
  SET marketerContraction = 0
  WHERE marketerId = ?
  `;

  const setWarningQuery = `
  UPDATE marketerDebit
  SET warning = 1 
  WHERE marketerId = ?
  `;

  return new Promise((resolve, reject) => {
    connection.query(marketerDebitQuery, [marketerId], (err1, result) => {
      if (err1) {
        console.log('marketerZeroCalculate err1');
        console.log(err1);
        reject(err1);
      } else {
        const debit = result[0].cashAmount;
        const { warning } = result[0];
        // 현재의 잔액보다 계산되어야하는 가격이 크다면.
        if (debit <= 0) {
          // transaction open and Promise chain start!!!
          Promise.all([
            doTransacQuery({ connection, queryState: emptyQuery, params: [marketerId] })
              .then(doTransacQuery({ connection, queryState: campaignSetQuery, params: [marketerId] }))
              .then(doTransacQuery({ connection, queryState: marketerSetQuery, params: [marketerId] })),
            Notification({
              userType: 'marketer',
              type: 'runOut',
              targetId: marketerId
            })
          ])
            .then(() => {
              console.log(`${marketerId}의 잔액을 모두 소모하였습니다.`);
              resolve();
            })
            .catch((errorData) => {
              errorData.point = 'marketerZeroCalculate()';
              errorData.description = `${debit} 만큼의 손해를 입고 ${marketerId}의 잔액을 모두 소모하여 값을 0으로 변경하는 과정`;
              reject(errorData);
            });
        } else if (debit <= 10000 && warning === 0) {
          Promise.all([
            doTransacQuery({ connection, queryState: setWarningQuery, params: [marketerId] }),
            Notification({
              userType: 'marketer',
              type: 'readyTorunOut',
              targetId: marketerId
            }),
            sendAlimtalk(marketerId)
          ]).then(() => {
            resolve();
          });
        } else {
          resolve();
        }
      }
    });
  });
};

const zeroCalculateConnectionWarp = ({ marketerList }) => new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) {
      reject(err);
    } else {
      Promise.all(
        marketerList.map((marketerId) => marketerZeroCalculate({ connection, marketerId }))
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

const dailyLimitCalculate = ({ connection, campaignId }) => {
  const campaignDailyLimitQuery = `
  SELECT optionType, dailyLimit
  FROM campaign 
  WHERE campaignId = ?`;

  const dayAmountQuery = `
  select sum(cashFromMarketer) as count
  from campaignLog
  where campaignId = ?
  and DATE(date) = DATE(?) `;

  const offQuery = `
  UPDATE campaign
  SET limitState = 1
  WHERE campaignId = ?`;


  return new Promise((resolve, reject) => {
    doConnectionQuery({ connection, queryState: campaignDailyLimitQuery, params: [campaignId] })
      .then((result) => {
        const { optionType, dailyLimit } = result[0];
        const today = new Date();
        doConnectionQuery({ connection, queryState: dayAmountQuery, params: [campaignId, today] })
          .then((row) => {
            // count = 현재 이 마케터가 쓴 캐시 총합
            const { count } = row[0];
            if (count === null || dailyLimit <= 1) {
              resolve();
              return;
            }
            if (count + 2000 > dailyLimit) {
              // 한도를 초과하였으므로 캠페인을 종료시킵니다.
              doTransacQuery({ connection, queryState: offQuery, params: [campaignId] });
            }
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const dailyLimitCalculateConnectionWarp = ({ campaignList }) => new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) {
      reject(err);
    } else {
      Promise.all(
        campaignList.map((campaignId) => dailyLimitCalculate({ connection, campaignId }))
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


const calculateConnectionWrap = ({
  creatorId, campaignId, cashFromMarketer, cashToCreator, viewer
}) => new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
    }
    Promise.all([
      creatorCalculate({
        connection, price: cashToCreator, creatorId
      }),
      marketerCalculate({ connection, campaignId, price: cashFromMarketer }),
      campaignCalculate({
        connection, creatorId, campaignId, cashFromMarketer, cashToCreator, viewer
      })
    ])
      .then(() => {
        connection.release();
        resolve();
      })
      .catch((errorData) => {
        connection.release();
        reject(errorData);
      });
  });
});

// next calculation
const nextCalculate = ({ marketerList, campaignList }) => new Promise((resolve, reject) => {
  setTimeout(() => {
    Promise.all([
      zeroCalculateConnectionWarp({ marketerList }),
      dailyLimitCalculateConnectionWarp({ campaignList }),
    ])
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  }, 30000);
});


// 계산프로그램시 필요한 함수
async function getList(date) {
  // 계산할 대상을 탐색하는 함수.
  const creatorList = await getcreatorList({ date });

  const streamList = await connectionWarp({ func: getStreamList, params: { creatorList } });

  // viewer가 0인 경우, 제거.
  const returnList = streamList.reduce((result, streamData) => {
    if (Object.keys(streamData).length !== 0) {
      result.push(streamData);
    }
    return result;
  }, []);
  return returnList;
}

const calculationPromise = async () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - 10);
  const calculateList = await getList(date);

  return new Promise((resolve, reject) => {
    if (calculateList.length === 0) {
      console.log(`계산 항목이 존재하지 않으므로 계산 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
      resolve();
    } else {
      console.log(`CPM 계산을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);
      const marketerList = [];
      const campaignList = [];
      Promise.all(
        calculateList.map(({
          creatorId, campaignId, cashFromMarketer, cashToCreator, viewer
        }) => calculateConnectionWrap({
          creatorId, campaignId, cashFromMarketer, cashToCreator, viewer
        }).then(() => {
          const marketerId = campaignId.split('_')[0];
          if (!marketerList.includes(marketerId)) {
            marketerList.push(marketerId);
          }
          if (!campaignList.includes(campaignId)) {
            campaignList.push(campaignId);
          }
        }))
      )
        .then(
          nextCalculate({ marketerList, campaignList })
            .then(() => {
              console.log(`CPM 계산을 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
              resolve();
            })
            .catch((errorData) => {
              console.log('-----------------------------------------------------------');
              console.log(errorData.sqlMessage);
              console.log('--------위의 사유로 인하여 에러가 발생하였습니다.-------------');
              console.log(`CPM 계산을 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
              resolve();
            }) // 에러 핸들링 여부 확인
        )
        .catch((errorData) => {
          console.log('-----------------------------------------------------------');
          console.log(errorData.sqlMessage);
          console.log('--------위의 사유로 인하여 에러가 발생하였습니다.-------------');
          console.log(`CPM 계산을 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
          resolve();
        });
    }
  });
};

module.exports = calculationPromise;
