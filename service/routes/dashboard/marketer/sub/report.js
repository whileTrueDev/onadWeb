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

router.get('/creators', (req, res) => {
  const { campaignId } = req.query;

  // name: '화수르',
  // twitchId: 'iamsupermazinga',
  // logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/e14cbb83-71ba-46eb-8fc1-9fd484da2db2-profile_image-300x300.png',
  // total_ad_exposure_amount: 123123,
  // total_ad_time: 123
  // most_contents: '오버워치',
  // avg_viewer: 150,
  // avg_broadcast_time: 7,

  const query = `
  SELECT
    ci.creatorName, ci.creatorTwitchId,
    ci.creatorLogo, sum(cashFromMarketer) AS total_ad_exposure_amount
  FROM campaignLog as cl
  JOIN creatorInfo as ci
  ON cl.creatorId = ci.creatorId
  WHERE campaignId = ?
  GROUP BY cl.creatorId
  ORDER BY total_ad_exposure_amount DESC
  LIMIT 30`;

  doQuery(query, [campaignId])
    .then((row) => {
      if (!row.error && row.result) {
        res.send(row.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
