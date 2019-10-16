const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

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

// 캠페인 삭제
router.delete('/', (req, res) => {
  const { campaignId } = req.body.data;
  const query = `
  UPDATE campaign
  SET deletedState = 1
  WHERE campaignId = ?`;
  const queryArray = [campaignId];

  doQuery(query, queryArray)
    .then((row) => {
      if (row.result) {
        res.send([true]);
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

router.post('/onoff', (req, res) => {
  const { onoffState, campaignId } = req.body; // boolean값
  const query = `
  UPDATE campaign
  SET onOff = ?
  WHERE campaignId = ?`;

  const queryArray = [onoffState, campaignId];

  doQuery(query, queryArray)
    .then((row) => {
      if (row.result) {
        res.send([true]);
      }
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
    cl.date as date,
    sum(cash) as cash, type
  FROM campaignLog AS cl
  WHERE SUBSTRING_INDEX(cl.campaignId, '_', 1) = ?
    AND  cl.date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date DESC
  `;
  const queryArray = [marketerId];

  doQuery(query, queryArray)
    .then((row) => { res.send(row.result); })
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
  (campaignId, creatorId)
  VALUES (?, ?)
  `;

  if (priorityType !== 1) {
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
  (campaignId, campaignName, marketerId, bannerId, dailyLimit, priorityType, optionType, onOff, targetList) 
  VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`;

  // 캠페인 등록.
  doQuery(searchQuery, [marketerId])
    .then((row) => {
      const campaignId = getCampaignId(row.result[0], marketerId);
      const limit = (optionType === 0 && noBudget) || optionType === 1 ? -1 : dailyLimit;
      const targetJsonData = JSON.stringify({ targetList: priorityList });
      Promise.all([
        doQuery(saveQuery,
          [campaignId, campaignName, marketerId, bannerId, limit,
            priorityType, optionType, targetJsonData]),
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
