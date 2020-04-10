require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const pool = require('../model/connectionPool');
// 시청자수 1회당 가격

const START_TIME = '2020-03-17 12:25:00';
const END_TIME = '2020-03-17 18:00:00';

// const END_TIME = '2020-03-19 12:05:00';
const PPP = 2;
const FEERATE = 0.5;


// 커넥션을 전달 받아 쿼리문을 수행한다. 트랜잭션을 사용하기 때문에
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

const doConnectionQuery = ({ connection, queryState, params }) => new Promise((resolve, reject) => {
  connection.query(queryState, params, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});


const getviewer = ({
  connection, creatorId, date
}) => {
  // 9시간을 제한 값을 통해 streamId를 들고올 수 있다.
  const streamIdQuery = `
  select creatorName
  from creatorInfo
  where creatorId = ?
  `;

  const viewerQuery = ` 
  SELECT viewer
  FROM twitchStreamDetail 
  WHERE streamerName = ?
  AND time < ?
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
      const { creatorName } = result[0];
      connection.query(viewerQuery, [creatorName, date], (err2, result1) => {
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

const getVaule = ({
  connection, campaignId, creatorId, date
}) => new Promise((resolve, reject) => {
  Promise.all([
    getviewer({ connection, creatorId, date }),
    getprice({ connection, campaignId })
  ])
    .then(([viewer, price]) => {
      const streamData = { viewer };
      streamData.cashFromMarketer = Math.round(Number(viewer) * Number(price) * PPP);

      // 크리에이터에게 전달되는 금액은 PPP(노출 1회당 가격) X viewer(10분동안의 노출량) X unitPrice(마케터 고유의 가격) X FEERATE(세율)
      streamData.cashToCreator = Math.round(Math.round(Number(viewer) * Number(price) * PPP) * FEERATE);
      resolve(streamData);
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
  connection, id, cashFromMarketer, cashToCreator, date
}) => {
  const queryState = `
    UPDATE campaignLog
    SET cashFromMarketer = ?, cashToCreator = ?, date = ?
    WHERE id = ?`;
  return doTransacQuery({ connection, queryState, params: [cashFromMarketer, cashToCreator, date, id] });
};

// 하나의 캠페인 로그를 받아서 행위를 시작
const doCalculation = async ({ connection, campaignLog }) => {
  const {
    id, date, campaignId, creatorId
  } = campaignLog;
  const { viewer, cashFromMarketer, cashToCreator } = await getVaule({
    connection, campaignId, creatorId, date
  });

  // console.log(`${creatorId} 에게 ${cashFromMarketer}, ${cashToCreator} 을 제공합니다.`);

  if (cashToCreator === 0) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  return new Promise((resolve, reject) => {
    Promise.all([
      creatorCalculate({
        connection, price: cashToCreator, creatorId
      }),
      marketerCalculate({ connection, campaignId, price: cashFromMarketer }),
      campaignCalculate({
        connection, id, cashFromMarketer, cashToCreator, date
      })
    ])
      .then(() => {
        resolve();
      });
  });
};


// 누락된 캠페인 로그를 가져온다.
const getcalculationList = (start, end) => {
  const selectQuery = `
  SELECT * FROM 
  campaignLog 
  WHERE date < '${end}'
  AND date > '${start}'
  AND type = "CPM"
  ORDER BY date`;

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log('getcalculationList 오류');
        reject(err);
      } else {
        doConnectionQuery({ connection, queryState: selectQuery, params: [] })
          .then((data) => {
            resolve(data);
          });
      }
    });
  });
};


const dividedCalculation = (targetList) => new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      // 100개씩 잘라서 수행 시작.
      Promise.all(
        targetList.map((campaignLog) => doCalculation({ connection, campaignLog }))
      ).then(() => {
        connection.release();
        setTimeout(() => {
          resolve();
        }, 20000);
      });
    }
  });
});


const forEachPromise = (items, fn) => items.reduce((promise, item) => promise.then(() => fn(item)), Promise.resolve());


async function calculation(start, end) {
  const listData = await getcalculationList(start, end);
  const listLength = listData.length;

  const turns = Math.ceil(listData.length / 30);
  const targetList = [];
  for (let i = 0; i < turns;) {
    const targets = listData.splice(0, 30);
    targetList.push(targets);
    i += 1;
  }
  console.log(`${listLength}의 갯수만큼 ${start} ~ ${end}을 시작합니다.`);

  forEachPromise(targetList, dividedCalculation).then(() => {
    console.log(`${listLength}의 갯수만큼 ${start} ~ ${end}을 완료하였습니다.`);
  });
}


async function doSchedule() {
// const START_TIME = '2020-03-17 12:25:00';
// const END_TIME = '2020-03-17 18:00:00';

  await calculation('2020-03-17 18:00:00', '2020-03-18 00:00:00');
  await calculation('2020-03-18 00:00:00', '2020-03-18 06:00:00');
  await calculation('2020-03-18 06:00:00', '2020-03-18 12:00:00');
  await calculation('2020-03-18 12:00:00', '2020-03-18 18:00:00');
  await calculation('2020-03-18 18:00:00', '2020-03-19 00:00:00');
  await calculation('2020-03-19 00:00:00', '2020-03-19 06:00:00');
  await calculation('2020-03-19 06:00:00', '2020-03-19 12:25:00');
}

calculation();
