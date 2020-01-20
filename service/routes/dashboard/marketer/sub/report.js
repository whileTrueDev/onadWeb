const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

// 리포트 필요 데이터
router.get('/', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const { campaignId } = req.query;
  // 켐페인 이름
  const query = `
  SELECT 
    (SELECT campaignName 
      FROM campaign 
      WHERE campaignId = ?) AS campaignName,
    
    (SELECT SUM(cashFromMarketer)
      FROM campaignLog as cl
      WHERE campaignId= ? AND type="CPM") AS totalCPM,
    
    (SELECT SUM(cashFromMarketer)
          / (SELECT unitPrice FROM marketerDebit WHERE marketerId = ?)
      FROM campaignLog as cl
      WHERE campaignId= ? AND type="CPM") AS totalViewCount,
      
    (SELECT count(*) / 6
      FROM campaignLog
      WHERE campaignId = ?) AS totalTime,
    
    (SELECT SUM(cashFromMarketer)
      FROM campaignLog
      WHERE campaignId= ? AND type="CPC") AS totalCPC,
    
    (SELECT SUM(clickCount)
      FROM landingClick 
      WHERE campaignId = ?) AS totalClick,
    
    (SELECT SUM(transferCount)
      FROM landingClick 
      WHERE campaignId = ?) AS totalTransfer,

    (SELECT count(*) FROM landingClickIp
      WHERE date > (SELECT regiDate FROM campaign WHERE campaignId = ?)) AS totalLandingView
    `;

  doQuery(query, [
    campaignId, campaignId, marketerId, campaignId,
    campaignId, campaignId, campaignId, campaignId, campaignId
  ]) // 캠페인 이름
    .then((row) => {
      if (!row.error && row.result) {
        res.send(row.result[0]);
      }
    })
    .catch((err) => {
      console.log('reportPage: ', err);
      res.end();
    });
});

router.get('/totalSpendChart', (req, res) => {
  const { campaignId } = req.query;

  const totalQuery = `
  SELECT
    cl.date as date,
    sum(cashFromMarketer) as cash, type
  FROM campaignLog AS cl
  WHERE campaignId = ? AND cl.date > DATE_SUB(cl.date, INTERVAL 30 DAY)
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date ASC
  `;

  const cpmQuery = `
  SELECT
    cl.date as date,
    sum(cashFromMarketer) as cash, type
  FROM campaignLog AS cl
  WHERE campaignId = ?
    AND type="CPM"
    AND cl.date > DATE_SUB(cl.date, INTERVAL 30 DAY)
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date ASC
  `;

  const cpcQuery = `
  SELECT
    cl.date as date,
    sum(cashFromMarketer) as cash, type
  FROM campaignLog AS cl
  WHERE campaignId = ?
    AND type="CPC"
    AND cl.date > DATE_SUB(cl.date, INTERVAL 30 DAY)
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date ASC
  `;

  Promise.all([
    doQuery(totalQuery, campaignId),
    doQuery(cpmQuery, campaignId),
    doQuery(cpcQuery, campaignId),
  ])
    .then((row) => {
      const resData = row.map(value => value.result);
      res.send(resData);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

router.get('/cpm', (res, req) => {
  const { campaignId } = req.query;

  const getStreamerQuery = `
  SELECT count(*), creatorId 
  FROM campaignLog 
  WHERE campaignId = ?
  GROUP BY creatorId
  ORDER BY count(*) DESC
  `;
  Promise.all([
    doQuery(getStreamerQuery, campaignId)
  ]).then((row) => {
    const resData = row.map(value => value.result);
    res.send(resData);
  })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// creator 정보 - CPM: 송출 크리에이터
router.get('/creators', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const { campaignId } = req.query;

  let query = '';
  let queryArray = [];
  if (campaignId) {
    query = `
    SELECT
      ci.creatorId, ci.creatorName, ci.creatorTwitchId,
      ci.creatorLogo, sum(cashFromMarketer) AS total_ad_exposure_amount,
      cd.viewer, cd.followers, cd.airtime, cd.impression, cd.openHour, cd.content
    FROM campaignLog as cl
    JOIN creatorInfo as ci
    ON cl.creatorId = ci.creatorId
    LEFT JOIN creatorDetail AS cd
    ON cl.creatorId = cd.creatorId
    WHERE campaignId = ?
    GROUP BY cl.creatorId
    ORDER BY total_ad_exposure_amount DESC`;

    queryArray = [campaignId];
  } else {
    query = `
    SELECT
      ci.creatorId, ci.creatorName, ci.creatorTwitchId,
      ci.creatorLogo, sum(cashFromMarketer) AS total_ad_exposure_amount,
      cd.viewer, cd.followers, cd.airtime, cd.impression, cd.openHour, cd.content
    FROM campaignLog as cl
    JOIN creatorInfo as ci
    ON cl.creatorId = ci.creatorId
    LEFT JOIN creatorDetail AS cd
    ON cl.creatorId = cd.creatorId
    WHERE SUBSTRING_INDEX(campaignId, '_', 1) = ?
    GROUP BY cl.creatorId
    ORDER BY total_ad_exposure_amount DESC`;

    queryArray = [marketerId];
  }

  doQuery(query, queryArray)
    .then((row) => {
      if (!row.error && row.result) {
        res.send(row.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// 일별 click 정보 - CPC: 히트맵
router.get('/clicks', (req, res) => {
  const { campaignId } = req.query;

  const query = `
  SELECT
  DATE_FORMAT(date, "%Y-%m-%d") AS date,
  count(*) AS count
  FROM landingClickIp
  WHERE campaignId = ?
  GROUP BY DATE_FORMAT(date, "%Y-%m-%d")
  ORDER BY DATE_FORMAT(date, "%Y-%m-%d") DESC`;
  const queryArray = [campaignId];

  doQuery(query, queryArray).then((row) => {
    if (!row.error && row.result) {
      res.send(row.result);
    }
  }).catch((err) => {
    console.log(err);
  });
});

// 특정 캠페인의 시작 이후, 채팅 내 언급 빈도
router.get('/commentonchat', (req, res) => {
  const { campaignId, keyword } = req.query;

  const query = `
  SELECT time, text, subscriber, manager, badges FROM twitchChat
  JOIN campaign ON campaignId = campaignId
  WHERE time > campaign.regiDate
  AND text like "%?%"`;

  const queryArray = [campaignId, keyword];

  doQuery(query, queryArray).then((row) => {

  }).catch((err) => {
    console.log('err in /report/commentonchat', err);
  });
});


router.get('/detail', (req, res) => {
  const { creatorId } = req.query;
  const selectQuery = `
  SELECT *
  FROM creatorDetail
  WHERE creatorId = ? `;

  doQuery(selectQuery, [creatorId])
    .then((row) => {
      let detailData = {};
      // string to JSON data
      if (row.result.length > 0) {
        const { timeGraphData, contentsGraphData } = row.result[0];

        detailData = {
          ...row.result[0],
          timeGraphData: JSON.parse(timeGraphData),
          contentsGraphData: JSON.parse(contentsGraphData),
        };
      }
      res.send(detailData);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end({});
    });
});

module.exports = router;
