const Notification = require('./notification');
const pool = require('../model/connectionPool');
const sendAlimtalk = require('./alimtalk');
const { doConnectionQuery, doTransacQuery } = require('../model/doQuery');
// 시청자수 1회당 가격
const PPP = 2;
const FEERATE = 0.5;

// *************************************************************
// 피계산 유저 및 유저 정보(시청자 수, 유저별 단가 등) 검색 함수 모음
// @주석작성  hwasurr 2020.12.31
// *************************************************************

// 현재시간은 5분, crawler가 활동하는 시기는 0분 타이밍이므로 10분을 깎아서
const getcreatorList = ({ date }) => {
  // 기준 시간 안에, 방송을 진행한 트위치 크리에이터 목록
  // @by hwasurr
  // 아프리카 연동 추가로 creatorId 가 무조건 streamerId를 의미하지 않는다.
  // creatorInfo의 creatorTwitchOriginalId 가 streamerId를 의미한다.
  const twitchStreamerListQuery = `
  SELECT B.streamerId, C.creatorId
  FROM (SELECT * FROM twitchStreamDetail WHERE time > ?) AS A
  LEFT JOIN twitchStream AS B ON A.streamId = B.streamId  
  JOIN creatorInfo AS C ON B.streamerId = C.creatorTwitchOriginalId`;

  // 기준 시간 안에, 방송을 진행한 온애드 연동된 아프리카 크리에이터 목록
  const afreecaStreamerListQuery = `
  SELECT B.userId AS streamerId, C.creatorId
  FROM (SELECT * FROM AfreecaBroadDetail WHERE createdAt > ?) AS A
  LEFT JOIN AfreecaBroad AS B ON A.broadId = B.broadId
  JOIN creatorInfo AS C ON B.userId = C.afreecaId
  `;

  // 광고 배너 송출 기록 조회 쿼리
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
  WHERE NOT campaign.limitState = 1 AND campaign.optionType = 1
  GROUP BY creatorId`; // LIVE배너광고(optionType=1)의 경우만 목록으로 불러온다.

  // 제약조건 추가. 계산하는 시간 내 광고 오버레이 OFF 버튼 존재시 그냥 해당 시점 밴
  const offListQuery = `
  SELECT creatorId
    FROM (
    SELECT advertiseUrl
    FROM bannerVisible
    WHERE date > ?
    AND type = 1
    AND visibleState = 0
    ) AS URL
  LEFT JOIN creatorInfo
  ON URL.advertiseUrl = creatorInfo.advertiseUrl
  GROUP BY creatorId
  `;

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log('getcreatorList 의 오류: 현재 방송 중이며, 배너를 게시하고 있는 creator 구하는 과정');
        reject(err);
      } else {
        Promise.all([
          doConnectionQuery({ connection, queryState: bannerListQuery, params: [date] }),
          doConnectionQuery({ connection, queryState: offListQuery, params: [date] }),
          doConnectionQuery({ connection, queryState: twitchStreamerListQuery, params: [date] }),
          doConnectionQuery({ connection, queryState: afreecaStreamerListQuery, params: [date] }),
        ])
          .then(([
            bannerListData,
            offListData,
            twitchStreamerListData,
            afreecaStreamerListData
          ]) => {
            // 배너 오버레이를 1번이라도 OFF 하였는가 여부 목록
            const offList = offListData.map((offData) => offData.creatorId);

            // 방송중인 아프리카 + 트위치 스트리머 데이터
            const streamers = twitchStreamerListData
              .concat(afreecaStreamerListData)
              .map((streamerData) => streamerData.creatorId);

            // 아프리카 / 트위치 둘중 하나라도 방송인 스트리머 목록
            const uniqueStreamers = Array.from(new Set(streamers));

            const creators = bannerListData.reduce((result, bannerData) => {
              // 1. 배너 송출 목록에 있는 경우
              // 2. offList에 존재하지 않을 경우, 두 조건을 모두 충족시에만 계산항목으로 들어가도록 추가.
              if (uniqueStreamers.includes(bannerData.creatorId)
                && !offList.includes(bannerData.creatorId)) {
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
/**
 * 특정 크리에이터의 트위치 시청자수 가져오는 함수
 * @param {object} param0 커넥션, 크리에이터아이디
 */
const getTwitchViewer = ({ connection, creatorId }) => {
  // 해당 creatorId의 creatorOriginalId 를 통해 최신 streamId를 가져온다.
  const viewerQuery = `
  SELECT TS.streamId, viewer FROM twitchStream AS TS
  JOIN twitchStreamDetail AS TSD ON TS.streamId = TSD.streamId
    WHERE streamerId = (SELECT creatorTwitchOriginalId FROM creatorInfo WHERE creatorId = ? LIMIT 1)
    AND TSD.time > DATE_SUB(NOW(), INTERVAL 10 MINUTE)
  ORDER BY TSD.time DESC LIMIT 1
  `;

  // 함수의 인자로 커넥션을 하나 받는다.
  // query를 사용하여 값을 가져오는 것이기 때문에 Promise 객체를 생성하여 wrapping 한다.
  // transction을 하는 이유는 쓰기에 대한 오류를 범하지 않기 위해서이므로 읽기에는 사용하지 않는다.
  return new Promise((resolve, reject) => {
    connection.query(viewerQuery, [creatorId], (err1, result) => {
      if (err1) reject(err1);
      if (!(result.length > 0)) resolve(0); // 트위치 스트리밍 데이터가 없는 경우 0 처리
      else {
        const { streamId, viewer } = result[0];
        resolve(viewer);
      }
    });
  });
};

/**
 * 특정 크리에이터의 아프리카 시청자수를 가져오는 함수
 * @param {object} param0 커넥션, 크리에이터아이디
 */
const getAfreecaViewer = ({ connection, creatorId }) => {
  // 해당 creatorId의 afreecaId 를 통해 최신 streamId를 가져온다.
  const viewerQuery = `
  SELECT AB.broadId AS streamId, viewCount AS viewer
  FROM AfreecaBroad AS AB
  JOIN AfreecaBroadDetail AS ABD ON AB.broadId = ABD.broadId
  WHERE userId = (SELECT afreecaId FROM creatorInfo WHERE creatorId = ? LIMIT 1)
    AND ABD.createdAt > DATE_SUB(NOW(), INTERVAL 10 MINUTE)
  ORDER BY ABD.createdAt DESC LIMIT 1
  `;

  // 함수의 인자로 커넥션을 하나 받는다.
  // query를 사용하여 값을 가져오는 것이기 때문에 Promise 객체를 생성하여 wrapping 한다.
  // transction을 하는 이유는 쓰기에 대한 오류를 범하지 않기 위해서이므로 읽기에는 사용하지 않는다.
  return new Promise((resolve, reject) => {
    connection.query(viewerQuery, [creatorId], (err1, result) => {
      if (err1) reject(err1);
      if (!(result.length > 0)) resolve(0); // 아프리카 스트리밍 데이터가 없는 경우 0 처리
      else {
        const { streamId, viewer } = result[0];
        resolve(viewer);
      }
    });
  });
};

/**
 * 해당 캠페인의 unitPrice(캠페인별 단가)를 가져오는 함수
 * @param {object} param0 커넥션, 캠페인 ID
 */
const getprice = ({ connection, campaignId }) => {
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
const getStreamList = ({ connection, creatorList }) => Promise.all(
  creatorList.map(async ({ creatorId, campaignId }) => {
    const streamData = {
      creatorId,
      campaignId,
      viewer: 0
    };

    // ******************************************************
    // 해당 크리에이터의 현재 방송 시청자수 정보 viewer
    // 트위치 시청자 수 가져오기.
    const twitchViewer = await getTwitchViewer({ connection, creatorId });
    const afreecaViewer = await getAfreecaViewer({ connection, creatorId });

    streamData.twitchViewer = twitchViewer;
    streamData.afreecaViewer = afreecaViewer;

    const totalViewer = twitchViewer + afreecaViewer;

    if (totalViewer === 0) {
      return {};
    }

    // ******************************************************
    // 수익금 캐시 정보 가져오기. (cashToCreator, cashFromMarketer)
    // 마케터의 unitprice를 가져온다.
    const unitPrice = await getprice({ connection, campaignId });

    streamData.viewer = totalViewer || 0;

    // 마케터에게서 징수하는 금액은 PPP(노출 1회당 가격) X viewer(10분동안의 노출량) X unitPrice(마케터 고유의 가격)
    streamData.cashFromMarketer = Math.round(
      Number(totalViewer) * Number(unitPrice) * PPP
    );

    // 크리에이터에게 전달되는 금액은 PPP(노출 1회당 가격) X viewer(10분동안의 노출량) X unitPrice(마케터 고유의 가격) X FEERATE(세율)
    streamData.cashToCreator = Math.round(
      Math.round(Number(totalViewer) * Number(unitPrice) * PPP) * FEERATE
    );

    return streamData;
  })
);


// *************************************************************
// 계산 작업 모음. 크리에이터 계산. 마케터 계산, 캠페인 계산
// @주석작성  hwasurr 2020.12.31
// *************************************************************

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

// 크리에이터 수익금 추가 처리
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

// 마케터 광고 캐시 차감 처리
const marketerCalculate = ({ connection, campaignId, price }) => {
  const marketerId = campaignId.split('_')[0];
  const queryState = `
  UPDATE marketerDebit 
  SET cashAmount = cashAmount - ? 
  WHERE marketerId = ? `;
  return doTransacQuery({ connection, queryState, params: [price, marketerId] });
};

// 캠페인 광고 로그 처리
const campaignCalculate = ({
  connection, creatorId, campaignId, cashFromMarketer, cashToCreator, viewer, twitchViewer, afreecaViewer
}) => {
  const queryState = `
    INSERT INTO campaignLog
    (campaignId, creatorId, type, cashFromMarketer, cashToCreator, viewer, twitchViewer, afreecaViewer) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  return doTransacQuery({
    connection,
    queryState,
    params: [campaignId, creatorId, 'CPM', cashFromMarketer, cashToCreator, viewer, twitchViewer, afreecaViewer]
  });
};

// *************************************************************
// Next 계산. (광고비 소진 처리, 캠페인 별 일일예산 처리)
// @주석작성  hwasurr 2020.12.31
// *************************************************************

// 광고 소진 처리 및 광고 10000원 이하 소진 임박 처리
const marketerZeroCalculate = ({ connection, marketerId }) => {
  const marketerDebitQuery = `
  SELECT cashAmount, warning
  FROM marketerDebit 
  WHERE marketerId = ? `;

  const emptyQuery = `
  UPDATE marketerDebit 
  SET cashAmount = 0 
  WHERE marketerId = ? `;

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
            doTransacQuery({ connection, queryState: emptyQuery, params: [marketerId] }),
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

// 캠페인별 일일 예산 처리
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

// *************************************************************
// 계산 작업 단위 함수 ( 계산 시작 / 계산 후 처리 시작 )
// @주석작성  hwasurr 2)020.12.31
// *************************************************************

/**
 * 실 광고 송출 수익금 계산 작업
 * @param {Object} 계산 진행할 대상
 */
const calculateConnectionWrap = ({
  creatorId, campaignId, cashFromMarketer, cashToCreator, viewer, twitchViewer, afreecaViewer
}) => new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
    }
    Promise.all([
      // 크리에이터 수익금 추가 처리 (creatorIncome)
      creatorCalculate({ connection, price: cashToCreator, creatorId }),
      // 마케터 광고캐시 차감 처리 (marketerDebit)
      marketerCalculate({ connection, campaignId, price: cashFromMarketer }),
      // 광고 진행 로그 처리 (campaignLog)
      campaignCalculate({
        connection,
        creatorId,
        campaignId,
        cashFromMarketer,
        cashToCreator,
        viewer,
        twitchViewer,
        afreecaViewer
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

// 계산 이후 처리 작업 ( 소진 처리, 일일 예산 처리 )
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

// *************************************************************
// 계산 작업 시작. 계산 작업 함수들을 조합하여 사용함.
// @주석작성  hwasurr 2020.12.31
// *************************************************************

/**
 * 기준 날짜를 통해 계산 대상 목록을 반환합니다.  
 * 계산대상은 기준 날짜 이전에 방송을 진행하였으며, 해당 방송의 시청자수가 0이 아니며, 온애드 광고를 송출한 크리에이터 목록입니다.
 * @param {Date} date 계산 대상 목록을 가져올 기준 날짜
 */
async function getList(date) {
  // 계산할 대상을 탐색하는 함수.
  const creatorList = await getcreatorList({ date });

  // 계산할 대상의 방송 정보 (시청자수, cashToCreator, cashFromMarketer), 
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

/**
 * CPM 배너광고 계산 실행 함수
 * 아프리카 tv 연동 추가. 아프리카 tv 시청자수 까지 반영하여 계산 작업 실행.
 */
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
        calculateList.map((calculateTarget) => calculateConnectionWrap({
          creatorId: calculateTarget.creatorId,
          campaignId: calculateTarget.campaignId,
          cashFromMarketer: calculateTarget.cashFromMarketer,
          cashToCreator: calculateTarget.cashToCreator,
          viewer: calculateTarget.viewer,
          twitchViewer: calculateTarget.twitchViewer,
          afreecaViewer: calculateTarget.afreecaViewer
        }).then(() => {
          const marketerId = calculateTarget.campaignId.split('_')[0];
          if (!marketerList.includes(marketerId)) {
            marketerList.push(marketerId);
          }
          if (!campaignList.includes(calculateTarget.campaignId)) {
            campaignList.push(calculateTarget.campaignId);
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
