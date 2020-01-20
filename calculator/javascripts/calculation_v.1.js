// 1. Table 중, twitchStreamDetail, twitchGame, twitchStream
// 2. CreatorId를 twitchStreamDetail에 확인하기 위해서
// 3. 현재시각 10분전부터 끌어모아 Listup
// 4. StreamerName 으로 조회하여 존재하는지 여부 확인. => 방송중이라는 의미
const schedule = require('node-schedule');
const doQuery = require('../model/calculatorQuery');
const logger = require('./calculatorLogger');
const Notification = require('./notification');
/* 2019-10-08

doQuery 모듈을 사용한 Error handling 및 동기식 수행.
Creator 및 Marketer에 대해 계산시 필요한 table 고려후 초기값 삽입.

1. Creator 관련 table

  - creatorInfo
  > 최초 로그인시 Data 삽입.

  - creatorIncome
  > 최초 로그인시 (Total, Will) => (0,0)으로 삽입.

  - creatorPrice
  > 최초 로그인시 (grade, viewCount, unitPrice) => (1,0,1)으로 삽입.

  - creatorWithdrawal
  > 환급 신청시에 기입하므로 초기값은 필요하지 않음.

2. Marketer 관련 table

  - marketerCost
  > 최초 로그인시 (marketerDebit)=>(0)으로 삽입.

  - marketerCash
  > 최초 로그인시 (chargeCash, withdrawCash) => (0,0)으로 삽입.

3. 수정사항

- error handling을 위한 doQuery 사용
> 현재 Promise 객체를 return하는 함수를 Promise 객체를 return하는 doQuery를 사용하여 어떻게 대체할 것인가?

- query 객체를 통해 전달되는 error 객체
{
  cause : 'query', 'connction'
  error : '에러에 대한 내용'
}
*/
const FEERATE = 0.5;

const getStreamerList = () => {
  const currentTimeQuery = `
  SELECT time 
  FROM twitchStreamDetail 
  ORDER BY time DESC 
  LIMIT 1`;

  const streamerQuery = `
  SELECT B.streamerId
  FROM (SELECT * FROM twitchStreamDetail WHERE time > ?) AS A 
  LEFT JOIN twitchStream AS B 
  ON A.streamId = B.streamId `;

  return new Promise((resolve, reject) => {
    doQuery(currentTimeQuery)
      .then((row) => {
        const { time } = row.result[0];
        time.setMinutes(time.getMinutes() - 5);
        return time;
      })
      .then((time) => {
        doQuery(streamerQuery, [time])
          .then((inrow) => {
            const streamers = [];
            inrow.result.map((ininrow) => {
              streamers.push(ininrow.streamerId);
            });
            resolve(streamers);
          })
          .catch((errorData) => {
            errorData.point = 'getStreamerList()';
            errorData.description = '최신 streamerId을 구하는 과정';
            reject(errorData);
          });
      })
      .catch((errorData) => {
        errorData.point = 'getStreamerList()';
        errorData.description = 'twitchStreamDetail의 최신 time을 구하는 과정';
        reject(errorData);
      });
  });
};

const getCreatorList = (streamerList) => {
  console.log('현재 방송 중인 모든 creator의 list 계산 시작');

  const listQuery = `
  SELECT creatorId 
  FROM creatorInfo`;

  return new Promise((resolve, reject) => {
    doQuery(listQuery)
      .then((row) => {
        const creators = [];
        row.result.map((creator) => {
          if (streamerList.includes(creator.creatorId)) {
            creators.push(creator.creatorId);
          }
        });
        console.log(`현재 방송중인 creator는 ${creators} 입니다.`);
        resolve(creators);
      })
      .catch((errorData) => {
        errorData.point = 'getCreatorList()';
        errorData.description = '현재 방송 중인 creator 구하는 과정';
        reject(errorData);
      });
  });
};

/* 2019-07-08 박찬우
  contracionTimestamp table에서 가장 최신의 data를 가져오는 함수

  1. contractionTimestamp table의 역할.
  - 현재 계약이 집행중인 contraction의 list를 가져온다.
  - 이 contracion list와 현재 방송이 진행 중인 creator list를 통해 계산을 해야하는 실제 banner list를 추출한다.

 */
/* 2019-10-08 박찬우
  contractionTimestamp -> campaignTimestamp로 변경.

*/
const getCampaignList = () => {
  console.log('현재 광고가 집행중인 contracionId List를 계산합니다.');

  const CheckedCampaignQuery = `
  SELECT campaignId, creatorId
  FROM campaignTimestamp 
  WHERE date > ? 
  `;

  return new Promise((resolve, reject) => {
    const date = new Date();
    // date.setHours(date.getHours() + 9);
    date.setMinutes(date.getMinutes() - 10);
    doQuery(CheckedCampaignQuery, [date])
      .then((inrow) => {
        resolve(inrow.result);
      })
      .catch((errorData) => {
        errorData.point = 'getCampaignList()';
        errorData.description = 'campaignTimestamp table에서 최신 campaignId 가져오는 과정.';
        reject(errorData);
      });
  });
};

/* 2019-07-08 박찬우
  1. streamIdQuery의 역할

  - creatorId를 통하여 현재 방송을 진행하는 streamId를 가져온다.
  > 시청자 수는 streamId를 사용하여 조회할 수 있다.
  > 한명의 creator가 하루에 여러개의 stream을 방송할 수 있기 때문에

  2. viewerQuery의 역할

  - creator가 현재 방송중인 streamId를 통하여 실시간 viewer를 가져온다

 */
const getViewer = ({ creatorId }) => {
  console.log(`${creatorId}의 시청자수를 계산합니다.`);

  const streamIdQuery = `
  SELECT streamId 
  FROM twitchStream 
  WHERE streamerId = ? 
  ORDER BY startedAt DESC 
  LIMIT 1`;

  const viewerQuery = `
  SELECT viewer 
  FROM twitchStreamDetail 
  WHERE streamId = ? 
  ORDER BY time DESC 
  LIMIT 1`;

  return new Promise((resolve, reject) => {
    doQuery(streamIdQuery, [creatorId])
      .then((row) => {
        const { streamId } = row.result[0];
        return streamId;
      })
      .then((streamId) => {
        doQuery(viewerQuery, [streamId])
          .then((inrow) => {
            const { viewer } = inrow.result[0];
            resolve(viewer);
          })
          .catch((errorData) => {
            errorData.point = 'getViewer()';
            errorData.description = `${creatorId}의 viewer를 계산하는 과정.`;
            reject(errorData);
          });
      })
      .catch((errorData) => {
        errorData.point = 'getViewer()';
        errorData.description = `${creatorId}의 streamId를 구하는 과정`;
        reject(errorData);
      });
  });
};

const getPrice = ({ creatorId, campaignId }) => {
  console.log(`${creatorId}의 단위 가격을 계산합니다.`);
  const priceQuery = `
  SELECT unitPrice 
  FROM creatorPrice 
  WHERE creatorId = ?`;

  const marketerPriceQuery = `
  SELECT md.unitPrice
  FROM campaign
  LEFT JOIN marketerDebit AS md
  ON campaign.marketerId = md.marketerId
  WHERE campaign.campaignId = ?
  `;

  return new Promise((resolve, reject) => {
    Promise.all([
      doQuery(priceQuery, [creatorId]),
      doQuery(marketerPriceQuery, [campaignId])
    ])
      .then(([row, rrow]) => {
        const price = row.result[0].unitPrice;
        const marketerPrice = rrow.result[0].unitPrice;
        resolve(Math.round(Number(price * marketerPrice)));
      })
      .catch((errorData) => {
        errorData.point = 'getPrice()';
        errorData.description = `${creatorId}의 단위 가격을 계산하는 과정.`;
        reject(errorData);
      });
  });
};

/* 2019-10-08 박찬우
  contractionList -> campaignList로 변경.
*/
const getPriceList = ([creatorList, campaignList]) => {
  console.log('각 creator 마다 단가를 계산합니다');
  const campaigns = campaignList.reduce((result, campaignData) => {
    // 현재 방송중인 creator 중에서 banner를 게시하고 있다면?
    if (creatorList.includes(campaignData.creatorId)) {
      result.push(campaignData);
    }
    return result;
  }, []);

  return Promise.all(
    campaigns.map(async (campaignData) => {
      const [viewer, price] = await Promise.all([getViewer(campaignData), getPrice(campaignData)]);
      const returnData = {
        ...campaignData,
        price: viewer * price
      };
      return returnData;
    })
  );
};

const creatorCalcuate = ({ price, creatorId }) => {
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
    console.log(`${creatorId}에 대해 정산을 시작합니다.`);
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
};


/* 2019-10-08 박찬우
  marketerDebit table 변경
  contraction에서 campaign으로 변경.
*/
const marketerZeroCalculate = ({ marketerId }) => {
  console.log(`${marketerId}에 잔고확인을 시작합니다.`);
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
    doQuery(marketerDebitQuery, [marketerId])
      .then((row) => {
        const debit = row.result[0].cashAmount;
        const { warning } = row.result[0];
        return { debit, warning };
      })
      .then(({ debit, warning }) => {
        // 임계치의 값에 해당한다면,
        // 현재의 잔액보다 계산되어야하는 가격이 크다면.
        if (debit <= 0) {
          Promise.all([
            doQuery(emptyQuery, [marketerId]),
            doQuery(campaignSetQuery, [marketerId]),
            doQuery(marketerSetQuery, [marketerId]),
            Notification({
              userType: 'marketer',
              type: 'runOut',
              targetId: marketerId
            }),
          ])
            .then(() => {
              console.log(`${marketerId}의 잔액을 모두 소모하였습니다.`);
              logger.info(`${marketerId}의 잔액을 모두 소모하였습니다.`);
              resolve();
            })
            .catch((errorData) => {
              errorData.point = 'marketerZeroCalculate()';
              errorData.description = `${debit} 만큼의 손해를 입고 ${marketerId}의 잔액을 모두 소모하여 값을 0으로 변경하는 과정`;
              reject(errorData);
            });
        } else if (debit <= 10000 && warning === 0) {
          Promise.all([
            Notification({
              userType: 'marketer',
              type: 'readyTorunOut',
              targetId: marketerId
            }),
            doQuery(setWarningQuery, [marketerId])
          ]).then(() => {
            console.log(`${marketerId}의 잔고가 아직 존재합니다.`);
            resolve();
          });
        } else {
          console.log(`${marketerId}의 잔고가 아직 존재합니다.`);
          resolve();
        }
      })
      .catch((errorData) => {
        errorData.point = 'marketerZeroCalculate()';
        errorData.description = `${marketerId}의 잔고를 확인하는 과정`;
        reject(errorData);
      });
  });
};

/* 2019-10-08 박찬우
  marketerDebit table 변경
  marketerDebit => cashAmount으로 col 변경
*/
const marketerCalculate = ({ campaignId, price }) => {
  const marketerId = campaignId.split('_')[0];
  console.log(`${marketerId}에 대한 정산을 시작합니다.`);

  const countQuery = `
  UPDATE marketerDebit 
  SET cashAmount = cashAmount - ? 
  WHERE marketerId = ? `;

  return new Promise((resolve, reject) => {
    doQuery(countQuery, [price, marketerId])
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

const campaignCalculate = ({ creatorId, campaignId, price }) => {
  console.log(`계약인 ${campaignId}에 대한 정산을 시작합니다.`);
  const CTC = Math.round(Number(price) * FEERATE);
  const campaignLogQuery = `
    INSERT INTO campaignLog
    (campaignId, creatorId, type, cashFromMarketer, cashToCreator) 
    VALUES (?, ?, ?, ?, ?)`;

  return new Promise((resolve, reject) => {
    doQuery(campaignLogQuery, [campaignId, creatorId, 'CPM', price, CTC])
      .then(() => {
        console.log(`${price} 원을 ${campaignId} 에 등록하였습니다.`);
        logger.info(`${price} 원을 ${campaignId} 에 등록하였습니다.`);
        resolve();
      })
      .catch((errorData) => {
        errorData.point = 'contractionCalculate()';
        errorData.description = `${price} 원을 ${campaignId} 에 등록하는 과정`;
        reject(errorData);
      });
  });
};

async function getList() {
  try {
    logger.info(`탐색을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);
    const [streamerList, contractionList] = await Promise.all([getStreamerList(), getCampaignList()]);
    const creatorList = await getCreatorList(streamerList);

    if (creatorList.length === 0) {
      logger.info(`탐색을 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
      return [];
    }

    const priceList = await getPriceList([creatorList, contractionList]);
    logger.info(`탐색을 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
    return priceList;
  } catch (errorData) {
    console.log(errorData);
    console.log('--------위의 사유로 인하여 계산이 종료됩니다.-------------');
    logger.error(errorData);
    return [];
  }
}

async function calculation() {
  console.log(`계산을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);
  const priceList = await getList();
  // marketer에 대한 잔액확인을 위한 리스트 생성
  const marketerList = [];
  if (priceList.length === 0) {
    console.log('---------------------------------------------------');
    logger.info(`계산 항목이 존재하지 않으므로 계산 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
    console.log(`계산 항목이 존재하지 않으므로 계산 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
    return;
  }

  // 아래의 크리에이터 - 마케터의 계산의 차이를 통한 수수료 책정.
  await Promise.all(
    priceList.map(({ creatorId, campaignId, price }) => Promise.all([
      creatorCalcuate({ creatorId, price: Math.round(Number(price) * FEERATE) }),
      marketerCalculate({ campaignId, price }),
      campaignCalculate({ creatorId, campaignId, price })
    ])
      .then(() => {
        const marketerId = campaignId.split('_')[0];
        if (!marketerList.includes(marketerId)) {
          marketerList.push(marketerId);
          return marketerZeroCalculate({ marketerId });
        }
      })
      .catch((errorData) => {
        console.log('-----------------------------------------------------------');
        console.log(errorData);
        console.log('--------위의 사유로 인하여 에러가 발생하였습니다.-------------');
        logger.error(errorData);
      }))
  )
    .then(() => {
      logger.info(`계산을 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
      console.log(`계산을 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
    });
}


const scheduler = schedule.scheduleJob('5,15,25,35,45,55 * * * *', () => {
  calculation();
});

module.exports = scheduler;
