const express = require('express');
const bodyParser = require('body-parser');
const doQuery = require('../../../../model/doQuery');
const marketerActionLogging = require('../../../../middlewares/marketerActionLog');

const app = express();
const router = express.Router();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// 캠페인 정보 조회 - 캠페인 리스트 테이블
router.get('/', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const query = `
  SELECT *
  FROM campaign
  WHERE marketerId = ? AND c.deletedState = 0
  `;
  const queryArray = [marketerId];

  doQuery(query, queryArray)
    .then((row) => {
      res.send(row.result);
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

// 2019-12-06 새로운 대시보드(분석)을 위한 요청
// 캠페인 리스트 조회
// 2020-01-21 일일예산이 존재하는 경우 일일 현재까지 해당 캠페인을 통한 소비 계산하여 리턴
router.get('/new', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  const query = `
  SELECT
  campaignId, campaignName, optionType, priorityType, campaign.regiDate, onOff, bannerSrc, dailyLimit
  FROM campaign
  JOIN bannerRegistered AS br
  ON br.bannerId = campaign.bannerId
  WHERE campaign.marketerId = ?
  AND deletedState = 0
  ORDER BY br.regiDate DESC
  `;

  const sumQuery = `
  select sum(cashFromMarketer) as dailysum
  from campaignLog
  where campaignId = ?
  and date > ?
  `;

  doQuery(query, [marketerId]).then((row) => {
    if (row.result && !row.error) {
      Promise.all(
        row.result.map(campaignData => doQuery(sumQuery, [campaignData.campaignId, date])
          .then((inrow) => {
            const { dailysum } = inrow.result[0];
            return { ...campaignData, dailysum };
          }))
      ).then((campaignList) => {
        res.send(campaignList);
      });
    }
  }).catch((err) => {
    console.log('err in /campaign/new', err);
  });
});


// 캠페인 삭제
router.delete('/', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const { campaignId } = req.body.data;
  const query = `
  UPDATE campaign
  SET deletedState = 1 ,
  onOFF = 0
  WHERE campaignId = ?`;
  const queryArray = [campaignId];

  const selectQuery = `
  SELECT campaignName FROM campaign WHERE campaignId = ?`;

  doQuery(query, queryArray)
    .then((row) => {
      if (row.result) {
        res.send([true]);

        doQuery(selectQuery, [campaignId]).then((row1) => {
          if (!row1.error) {
            const { campaignName } = row1.result[0];
            // marketer action log 테이블 적재
            const MARKETER_ACTION_LOG_TYPE = 12; // <캠페인 삭제> 상태값
            marketerActionLogging([marketerId,
              MARKETER_ACTION_LOG_TYPE, JSON.stringify({ campaignName })]);
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});


// 캠페인 정보 조회 - 캠페인 리스트 테이블
router.get('/list', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  // ['onOff', '캠페인명', '일예산', '등록된 배너']
  const query = `
  SELECT
  campaignId, onOff, campaignName,
  FORMAT(dailyLimit, 0) as dailyLimit,
  priorityType, optionType, bannerSrc,
  DATE_FORMAT(c.regiDate, '%y년 %m월 %d일') as regiDate
  
  FROM campaign as c

  LEFT JOIN bannerRegistered as br
  ON br.bannerId = c.bannerId
  WHERE c.marketerId = ? AND c.deletedState = 0
  `;
  const queryArray = [marketerId];
  doQuery(query, queryArray)
    .then((row) => {
      if (!row.error && row.result.length > 0) {
        res.send({ data: row.result });
      } else {
        res.send(null);
      }
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

// 캠페인 광고 켜기 / 끄기
router.post('/onoff', (req, res) => {
  const { onoffState, campaignId } = req.body; // boolean값
  const query = `
  UPDATE campaign
  SET onOff = ?
  WHERE campaignId = ?`;

  const queryArray = [onoffState, campaignId];

  const selectQuery = `
  SELECT campaignName FROM campaign WHERE campaignId = ?`;

  doQuery(query, queryArray)
    .then((row) => {
      if (row.result) {
        res.send([true]);
      }

      doQuery(selectQuery, [campaignId]).then((row1) => {
        if (!row1.error) {
          const { campaignName } = row1.result[0];
          // 마케터 활동내역 테이블 적재
          const MARKETER_ACTION_LOG_TYPE = 6; // 마케터 활동내역 - 캠페인 on off상태값
          marketerActionLogging([campaignId.split('_')[0], MARKETER_ACTION_LOG_TYPE,
            JSON.stringify({ campaignName, onoffState })]);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

// 해당 마케터의 성과 차트 데이터 조회
// contractionValue
router.get('/chart', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const query = `
  SELECT
    DATE_FORMAT(max(cl.date), "%Y-%m-%d") as date,
    sum(cashFromMarketer) as cash, type
  FROM campaignLog AS cl
  WHERE SUBSTRING_INDEX(cl.campaignId, '_', 1) = ?
    AND  cl.date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date DESC
  `;
  const queryArray = [marketerId];

  doQuery(query, queryArray)
    .then((row) => {
      if (!row.error && row.result) {
        res.send(row.result);
      } else {
        res.send([false]);
      }
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

router.post('/checkName', (req, res) => {
  doQuery('SELECT campaignId FROM campaign WHERE campaignName = ? ', [req.body.campaignName])
    .then((row) => {
      const { result } = row;
      if (result[0]) {
        // ID가 존재합니다.
        res.send(true);
      } else {
        res.send(false);
      }
    })
    .catch(() => {
      res.send(false);
    });
});


router.post('/changeName', (req, res) => {
  const { campaignId, campaignName } = req.body;
  const updateQuery = `
  UPDATE campaign 
  SET campaignName = ? 
  WHERE campaignId = ? `;
  doQuery(updateQuery, [campaignName, campaignId])
    .then(() => {
      res.send([true, null]);
    })
    .catch((error) => {
      res.send([false, error]);
    });
});


router.post('/changeBudget', (req, res) => {
  const { campaignId, noBudget, budget } = req.body;
  const updateBudget = noBudget ? -1 : budget;
  const updateQuery = `
  UPDATE campaign 
  SET dailyLimit = ? 
  WHERE campaignId = ? `;

  doQuery(updateQuery, [updateBudget, campaignId])
    .then(() => {
      res.send([true, null]);
    })
    .catch((error) => {
      res.send([false, error]);
    });
});

router.post('/getcategory', (req, res) => {
  const getCategoryQuery = 'SELECT * FROM categoryCampaign WHERE categoryName = ?';
  const categoryArray = req.body;
  const dataArray = [];
  const numberArray = [];

  async function getArray(param) {
    return Promise.all(
      param.map(value => new Promise((resolve, reject) => {
        doQuery(getCategoryQuery, value)
          .then((row) => {
            const data = JSON.parse(row.result[0].campaignList).campaignList;
            data.forEach((innerData) => {
              if (dataArray.indexOf(innerData) === -1) { dataArray.push(innerData); }
            });
            resolve(true);
          })
          .catch((err) => {
            console.log('campaignjs 226 line', err);
            reject();
          });
      }))
    );
  }

  async function doSum(array) {
    const campaignArray = await getArray(array);
    const sumQuery = `SELECT SUM(cashFromMarketer) 
                      FROM campaignLog 
                      WHERE campaignId = ? 
                      AND DATE BETWEEN DATE_ADD(NOW(),INTERVAL -1 MONTH ) 
                      AND NOW();`;
    return Promise.all(
      dataArray.map(value => new Promise((resolve, reject) => {
        doQuery(sumQuery, value)
          .then((row) => {
            numberArray.push(parseInt(Object.values(row.result[0]), 10)); // 10진수
            resolve();
          })
          .catch((err) => {
            console.log('밑 에러 삐빅', err);
            reject();
          });
      }))
    );
  }

  function nanEraser(array) {
    const newArray = array.filter(value => !Number.isNaN(value));
    return newArray;
  }

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  doSum(categoryArray)
    .then(() => { res.send({ result: nanEraser(numberArray).reduce(reducer) }); });
  // getArray(categoryArray).then(() => { console.log(dataArray); });
});
// marketer가 campaign을 생성할 경우,
// campaign을 생성할 때, 각 옵션마다 다르게 수행하여야함.
// 1. 크리에이터 우선형일 경우, 크리에이터 Id에 해당하는 campaign list로 들어감.
// 2. 카테고리 우선형일 경우, 카테고리 Id에 해당하는 campaign list로 들어감.
// 3. 노출 우선형일 경우, 모든 크리에이터 Id에 해당하는 campaign list로 들어감.

// 위의 모든 행위는 optionType이  2(클릭광고만) 일 경우에는 사용하지 않는다.
// 왜냐하면 이모든 행위는 배너광고를 위한 list 작업이기 때문이다.
const PriorityDoquery = ({
  campaignId, priorityType, priorityList, optionType
}) => {
  const getSearchQuery = (type) => {
    switch (type) {
      case 0: {
        return 'SELECT campaignList FROM creatorCampaign WHERE creatorId = ?';
      }
      case 1: {
        return 'SELECT campaignList FROM categoryCampaign WHERE categoryName = ?';
      }
      case 2: {
        return 'SELECT campaignList FROM categoryCampaign WHERE categoryName = ?';
      }
      default: {
        return '';
      }
    }
  };

  const getSaveQuery = (type) => {
    switch (type) {
      case 0: {
        return `
        UPDATE creatorCampaign 
        SET campaignList = ? 
        WHERE creatorId = ?`;
      }
      case 1: {
        return `
        UPDATE categoryCampaign 
        SET campaignList = ? 
        WHERE categoryName = ?`;
      }
      case 2: {
        return `
        UPDATE categoryCampaign 
        SET campaignList = ?
        WHERE categoryName = ? `;
      }
      default: {
        return '';
      }
    }
  };

  const searchQuery = getSearchQuery(priorityType);
  const saveQuery = getSaveQuery(priorityType);

  if (optionType === 2) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  return Promise.all(
    priorityList.map(async targetId => new Promise((resolve, reject) => {
      doQuery(searchQuery, [targetId])
        .then((row) => {
          const jsonData = JSON.parse(row.result[0].campaignList);
          const newCampaignList = jsonData.campaignList.concat(campaignId);
          jsonData.campaignList = newCampaignList;
          doQuery(saveQuery, [JSON.stringify(jsonData), targetId])
            .then(() => {
              resolve();
            })
            .catch((errorData) => {
              console.log(errorData);
              reject(errorData);
            });
        })
        .catch((errorData) => {
          console.log(errorData);
          reject(errorData);
        });
    }))
  );

  // 노출우선형일 경우, priorityList가 모든 creator에 해당되어야함.
};

const getCreatorList = () => new Promise((resolve, reject) => {
  const creatorSelectQuery = `
  SELECT creatorId
  FROM creatorInfo
  WHERE creatorContractionAgreement = 1
  `;
  doQuery(creatorSelectQuery)
    .then((row) => {
      const creatorList = row.result.map(data => data.creatorId);
      resolve(creatorList);
    })
    .catch(() => {
      console.log('LandingDoQuery => getCreatorList');
      reject();
    });
});

// optionType == 2이면 랜딩페이지를 초기화하지 않는다.
// optionType === 1이면 노출우선형일때는 모든 크리에이터에게
// 크리에이터 우선형일때는 priorityList에 대해 초기화한다.

const LandingDoQuery = async ({
  campaignId, optionType, priorityType, priorityList
}) => {
  const insertQuery = `
  INSERT INTO landingClick
  (campaignId, creatorId)
  VALUES (?, ?)
  `;

  const creatorList = await getCreatorList();

  // 모든 크리에이터에게 할당하기.
  if (optionType === 2 && priorityType === 2) {
    return Promise.all(
      creatorList.map(async targetId => new Promise((resolve, reject) => {
        doQuery(insertQuery, [campaignId, targetId])
          .then((row) => {
            resolve();
          })
          .catch((errorData) => {
            console.log(errorData);
            reject(errorData);
          });
      }))
    );
  }

  // 주어지는 크리에이터 리스트에 대한 랜딩페이지 초기화
  if (optionType === 2) {
    return Promise.all(
      priorityList.map(async targetId => new Promise((resolve, reject) => {
        doQuery(insertQuery, [campaignId, targetId])
          .then((row) => {
            resolve();
          })
          .catch((errorData) => {
            console.log(errorData);
            reject(errorData);
          });
      }))
    );
  }
};

const getCampaignId = (result, marketerId) => {
  let campaignId = '';
  if (result) {
    const lastCampaignId = result.campaignId;
    const count = parseInt(lastCampaignId.split('_c')[1], 10) + 1;
    if (count < 10) {
      campaignId = `${marketerId}_c0${count}`;
    } else {
      campaignId = `${marketerId}_c${count}`;
    }
  } else {
    campaignId = `${marketerId}_c01`;
  }
  return campaignId;
};

const getUrlId = marketerId => new Promise((resolve, reject) => {
  let urlId = '';
  const getLandingUrlQuery = `SELECT linkId
                              FROM linkRegistered
                              WHERE marketerId = ?
                              ORDER BY regiDate DESC
                              LIMIT 1`;
  doQuery(getLandingUrlQuery, marketerId)
    .then((row) => {
      if (row.result[0]) {
        const lastlinkId = row.result[0].linkId;
        const count = parseInt(lastlinkId.split('_')[2], 10) + 1;
        if (count < 10) {
          urlId = `${marketerId}_0${count}`;
          resolve(urlId);
        } else {
          urlId = `${marketerId}_${count}`;
          resolve(urlId);
        }
      } else {
        urlId = `${marketerId}_01`;
        resolve(urlId);
      }
    }).catch((err) => {
      reject();
      console.log(err);
    });
});

router.get('/geturl', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const getLandingUrlQuery = `SELECT linkId
                              FROM linkRegistered
                              WHERE marketerId = ?
                              ORDER BY regiDate DESC
                            `;
  doQuery(getLandingUrlQuery, marketerId)
    .then((row) => {
      if (row.result) {
        res.send(row.result);
      }
    }).catch((err) => {
      console.log(err);
    });
});

router.post('/push', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const { marketerName } = req._passport.session.user;
  const {
    optionType, priorityType, campaignName, bannerId, budget, startDate, finDate,
    keyword0, keyword1, keyword2, mainLandingUrl, sub1LandingUrl, sub2LandingUrl,
    priorityList, selectedTime
  } = req.body;
  // 현재까지 중에서 최신으로 등록된 켐페인 명을 가져와서 번호를 증가시켜 추가하기 위함.
  const searchQuery = `
  SELECT campaignId
  FROM campaign 
  WHERE marketerId = ?  
  ORDER BY regiDate DESC
  LIMIT 1`;

  const saveQuery = `
  INSERT INTO campaign 
  (campaignId, campaignName, marketerId, 
    bannerId, connectedLinkId, dailyLimit, priorityType, 
    optionType, onOff, targetList, marketerName, 
    keyword, startDate, finDate, selectedTime) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?)`;

  const saveToLinkRegistered = `
  INSERT INTO linkRegistered
  (linkId, marketerId, confirmState, links)
  VALUES (?, ?, ?, ?)
  `;

  // 캠페인 등록.
  getUrlId(marketerId).then((urlId) => {
    doQuery(searchQuery, [marketerId])
      .then((row) => {
        const linkId = `link_${urlId}`;
        const campaignId = getCampaignId(row.result[0], marketerId);
        const limit = budget || -1;
        const targetJsonData = JSON.stringify({ targetList: priorityList });
        const landingUrlJsonData = JSON.stringify(
          {
            links:
            [{
              linkName: '',
              linkTo: mainLandingUrl,
              primary: true,
            },
            (sub1LandingUrl
              ? {
                linkName: '',
                linkTo: sub1LandingUrl,
                primary: false,
              } : null
            ),
            (sub2LandingUrl
              ? {
                linkName: '',
                linkTo: sub2LandingUrl,
                primary: false,
              } : null
            ),
            ]
          }
        );
        const keywordsJsonData = JSON.stringify(
          { keywords: [keyword0, keyword1, keyword2] }
        );
        // 마케터 활동내역 로깅 테이블에서, 캠페인 생성의 상태값
        const MARKETER_ACTION_LOG_TYPE = 5;
        Promise.all([
          doQuery(saveQuery,
            [campaignId, campaignName, marketerId, bannerId, linkId, limit,
              priorityType, optionType, targetJsonData, marketerName, keywordsJsonData,
              startDate, finDate, selectedTime]),
          (priorityType !== 0
            ? doQuery(saveToLinkRegistered, [linkId, marketerId, 0, landingUrlJsonData]) : null),
          PriorityDoquery({
            campaignId, priorityType, priorityList, optionType
          }),
          LandingDoQuery({
            campaignId, optionType, priorityType, priorityList
          }),
          // 마케터 활동내역 테이블 적재.
          marketerActionLogging([
            marketerId, MARKETER_ACTION_LOG_TYPE, JSON.stringify({ campaignName })
          ]),
        ])
          .then(() => {
            res.send([true, '캠페인이 등록되었습니다']);
          })
          .catch((err) => {
            console.log(err);
            res.send([false, '일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.']);
          });
      })
      .catch((err) => {
        console.log(err);
        res.send([false, '일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.']);
      });
  }).catch((err) => {
    console.log(err);
    res.send([false, '일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.']);
  });
});

module.exports = router;
