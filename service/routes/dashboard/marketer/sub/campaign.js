const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();


// 캠페인 온오프 조회
router.get('/onoff', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const contractionQuery = `
  SELECT marketerContraction
  FROM marketerInfo
  WHERE marketerId = ?
  `;

  doQuery(contractionQuery, [marketerId])
    .then((row) => {
      const data = row.result[0].marketerContraction === 1;
      res.send(data);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send(false);
    });
});

// 캠페인 On & Off 기능
// 잔액이 0원일 때는 불가능 하도록 정의.
router.post('/onoff', (req, res) => {
  const contractionState = req.body.contraction === false ? 0 : 1;
  const marketerId = req._passport.session.user.userid;
  const costQuery = `
  SELECT cashAmount
  FROM marketerDebit
  WHERE marketerId = ?
  `;

  const infoQuery = `
  UPDATE marketerInfo
  SET marketerContraction = ?
  WHERE marketerId = ?
  `;
  doQuery(costQuery, [marketerId])
    .then((row) => {
      const debit = row.result[0].cashAmount;
      if (debit === 0) {
        res.send(false);
      } else {
        doQuery(infoQuery, [contractionState, marketerId])
          .then(() => {
            res.send(true);
          })
          .catch((errorData) => {
            console.log(errorData);
            res.send(false);
          });
      }
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send(false);
    });
});

// 해당 마케터의 성과 차트 데이터 조회
// contractionValue
router.get('/chart', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const query = `
  SELECT
    cl.date as date,
    sum(cash) as cash, type
  FROM campaignLog AS cl
  WHERE SUBSTRING_INDEX(cl.campaignId, '_', 1) = ?
    AND  cl.date >= DATE_SUB(NOW(), INTERVAL 14 DAY)
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date DESC
  `;
  const queryArray = [marketerId];

  doQuery(query, queryArray)
    .then((row) => {
      /**
       * 필요 데이터 셋:
       * labels: [ '9월 9일', ... ]
       * dataSet: [ ... ]
       */
      res.send(row.result);
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

// marketer가 campaign을 생성할 경우,
// campaign을 생성할 때, 각 옵션마다 다르게 수행하여야함.
// 1. 크리에이터 우선형일 경우, 크리에이터 Id에 해당하는 campaign list로 들어감.
// 2. 카테고리 우선형일 경우, 카테고리 Id에 해당하는 campaign list로 들어감.
// 3. 노출 우선형일 경우, 모든 크리에이터 Id에 해당하는 campaign list로 들어감.

const PriorityDoquery = ({ campaignId, priorityType, priorityList }) => {
  const getSearchQuery = (type) => {
    switch (type) {
      case 0: {
        return 'SELECT campaignList FROM creatorCampaign WHERE creatorId = ?';
      }
      case 1: {
        return 'SELECT campaignList FROM categoryCampaign WHERE categoryName = ?';
      }
      case 2: {
        return 'SELECT campaignList FROM creatorCampaign WHERE creatorId = ?';
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
        UPDATE creatorCampaign 
        SET campaignList = ?
        WHERE creatorId = ? `;
      }
      default: {
        return '';
      }
    }
  };

  const searchQuery = getSearchQuery(priorityType);
  const saveQuery = getSaveQuery(priorityType);

  // 노출우선형일 경우, priorityList가 모든 creator에 해당되어야함.
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
};

// 크리에이터 우선형 및 노출 우선형일 경우 랜딩페이지 초기화.
const LandingDoQuery = ({ campaignId, priorityType, priorityList }) => {
  const insertQuery = `
  INSERT INTO landingClick
  (contractionId, campaignId, creatorId)
  VALUES (?, ?, ?)
  `;

  if (priorityType !== 1) {
    return Promise.all(
      priorityList.map(async targetId => new Promise((resolve, reject) => {
        doQuery(insertQuery, [campaignId, campaignId, targetId])
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
    const count = parseInt(lastCampaignId.split('_c')[1]) + 1;
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

router.post('/push', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const {
    bannerId, campaignName, dailyLimit, priorityType, optionType, priorityList, noBudget
  } = req.body;

  const searchQuery = `
  SELECT campaignId 
  FROM campaign 
  WHERE marketerId = ?  
  ORDER BY regiDate DESC
  LIMIT 1`;

  const saveQuery = `
  INSERT INTO campaign 
  (campaignId, campaignName, marketerId, bannerId, dailyLimit, priorityType, optionType, onOff) 
  VALUES (?, ?, ?, ?, ?, ?, ?, 1)`;

  // 캠페인 등록.
  doQuery(searchQuery, [marketerId])
    .then((row) => {
      const campaignId = getCampaignId(row.result[0], marketerId);
      const limit = (optionType === 0 && noBudget) || optionType === 1 ? -1 : dailyLimit;

      Promise.all([
        doQuery(saveQuery,
          [campaignId, campaignName, marketerId, bannerId, limit,
            priorityType, optionType]),
        PriorityDoquery({ campaignId, priorityType, priorityList }),
        LandingDoQuery({ campaignId, priorityType, priorityList })
      ])
        .then(() => {
          res.send([true, '캠페인이 등록되었습니다']);
        })
        .catch(() => {
          res.send([false]);
        });
    })
    .catch(() => {
      res.send([false]);
    });
});

// 1. creator우선형일 경우 실행되는 Promise 정의


// priorityType에 따라 쿼리가 달라짐.


module.exports = router;
