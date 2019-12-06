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
      WHERE creatorId
      IN (
        SELECT lci.creatorId
        FROM landingClickIp AS lci
        JOIN campaignLog AS cl ON cl.campaignId = ?
        JOIN campaign ON campaign.campaignId = ?
        WHERE landingClickIp.campaignId=?
        AND lci.date > regiDate
        AND lci.date < (
            SELECT max(date)
            FROM campaignLog WHERE campaignId = ?)
            GROUP BY lci.creatorId
          )
        ) AS totalLandingView,
      
    (SELECT SUM(cashFromMarketer)
      FROM campaignLog as cl
      WHERE campaignId= ? AND type="CPM"
      AND cl.date > DATE_SUB(now(), INTERVAL 14 DAY)) AS weeksCPM,
    
    (SELECT SUM(cashFromMarketer)
          / (SELECT unitPrice FROM marketerDebit WHERE marketerId = ?)
      FROM campaignLog as cl
      WHERE campaignId= ? AND type="CPM"
      AND cl.date > DATE_SUB(now(), INTERVAL 14 DAY)) AS weeksViewCount,
      
    (SELECT count(*) / 6
      FROM campaignLog as cl
      WHERE campaignId = ?
      AND cl.date > DATE_SUB(now(), INTERVAL 14 DAY)) AS weeksTime,
    
    (SELECT SUM(cashFromMarketer)
      FROM campaignLog as cl
      WHERE campaignId= ? AND type="CPC"
      AND cl.date > DATE_SUB(now(), INTERVAL 14 DAY)) AS weeksCPC,
    
    (SELECT SUM(clickCount)
      FROM landingClick
      WHERE campaignId = ?
      AND regiDate > DATE_SUB(now(), INTERVAL 14 DAY)) AS weeksClick,
    
    (SELECT SUM(transferCount)
      FROM landingClick
      WHERE campaignId = ?
      AND regiDate > DATE_SUB(now(), INTERVAL 30 DAY)) AS weeksTransfer,
      
      (SELECT SUM(cashFromMarketer)
      FROM campaignLog as cl
      WHERE campaignId= ? AND type="CPM"
      AND cl.date > DATE_SUB(now(), INTERVAL 30 DAY)) AS monthsCPM,
    
    (SELECT SUM(cashFromMarketer)
          / (SELECT unitPrice FROM marketerDebit WHERE marketerId = ?)
      FROM campaignLog as cl
      WHERE campaignId= ? AND type="CPM"
      AND cl.date > DATE_SUB(now(), INTERVAL 30 DAY)) AS monthsViewCount,
      
    (SELECT count(*) / 6
      FROM campaignLog as cl
      WHERE campaignId = ?
      AND cl.date > DATE_SUB(now(), INTERVAL 30 DAY)) AS monthsTime,
    
    (SELECT SUM(cashFromMarketer)
      FROM campaignLog as cl
      WHERE campaignId= ? AND type="CPC"
      AND cl.date > DATE_SUB(now(), INTERVAL 30 DAY)) AS monthsCPC,
    
    (SELECT SUM(clickCount)
      FROM landingClick
      WHERE campaignId = ?
      AND regiDate > DATE_SUB(now(), INTERVAL 30 DAY)) AS monthsClick,
    
    (SELECT SUM(transferCount)
      FROM landingClick
      WHERE campaignId = ?
      AND regiDate > DATE_SUB(now(), INTERVAL 30 DAY)) AS monthsTransfer`;

  doQuery(query, [
    campaignId, campaignId, marketerId,
    campaignId, campaignId, campaignId, campaignId,
    campaignId, campaignId, campaignId, campaignId, campaignId, // 기본
    campaignId, marketerId, campaignId, campaignId, campaignId, campaignId, campaignId, // weeks
    campaignId, marketerId, campaignId, campaignId, campaignId, campaignId, campaignId // months
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
  WHERE campaignId = ?
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date ASC
  `;

  const cpmQuery = `
  SELECT
    cl.date as date,
    sum(cashFromMarketer) as cash, type
  FROM campaignLog AS cl
  WHERE campaignId = ?
    AND type="cpm"
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date ASC
  `;

  const cpcQuery = `
  SELECT
    cl.date as date,
    sum(cashFromMarketer) as cash, type
  FROM campaignLog AS cl
  WHERE campaignId = ?
    AND type="cpc"
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
      ci.creatorName, ci.creatorTwitchId,
      ci.creatorLogo, sum(cashFromMarketer) AS total_ad_exposure_amount
    FROM campaignLog as cl
    JOIN creatorInfo as ci
    ON cl.creatorId = ci.creatorId
    WHERE campaignId = ?
    GROUP BY cl.creatorId
    ORDER BY total_ad_exposure_amount DESC`;

    queryArray = [campaignId];
  } else {
    query = `
    SELECT
      ci.creatorName, ci.creatorTwitchId,
      ci.creatorLogo, sum(cashFromMarketer) AS total_ad_exposure_amount
    FROM campaignLog as cl
    JOIN creatorInfo as ci
    ON cl.creatorId = ci.creatorId
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

// 2019-12-06 새로운 대시보드(분석)을 위한 요청
// 캠페인 리스트
router.get('/new', (req, res) => {
  const marketerId = req._passport.session.user.userid;

  const query = `
  SELECT
  campaignId, campaignName, optionType, priorityType, campaign.regiDate, onOff, bannerSrc
  FROM campaign
  JOIN bannerRegistered AS br
  ON br.bannerId = campaign.bannerId
  WHERE campaign.marketerId = ?
  AND deletedState = 0
  ORDER BY onOff DESC, br.regiDate DESC
  `;
  const queryArray = [marketerId];

  doQuery(query, queryArray).then((row) => {
    if (row.result && !row.error) {
      res.send(row.result);
    }
  }).catch((err) => {
    console.log('err in /report/new', err);
  });
});

router.get('/normal', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const query = `SELECT cashAmount, spendAll FROM
  (
    SELECT cashAmount
    FROM marketerDebit
    WHERE marketerId = ?) AS cashAmount,
  (
    SELECT sum(cashFromMarketer) AS spendAll
    FROM campaignLog
    WHERE SUBSTRING_INDEX(campaignId, "_" , 1) = ?) AS spendAll
  `;

  const queryArray = [marketerId, marketerId];
  doQuery(query, queryArray).then((row) => {
    if (row.result && !row.error) {
      res.send(row.result[0]);
    }
  }).catch((err) => {
    console.log('err in /report/new', err);
  });
});
module.exports = router;
