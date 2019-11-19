const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

router.get('/', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const { campaignId } = req.query;
  let data;
  // 켐페인 이름
  const getCampaignNameQuery = `
  SELECT campaignName 
  FROM campaign 
  WHERE campaignId=?;`;

  // 총 CPM 비용
  const getTotalCpmQuery = `
  SELECT SUM(cashFromMarketer) as totalCPM
  FROM campaignLog as cl
  WHERE campaignId= ? AND type="CPM";`;

  // 총 노출 수 ( 총 CPM 비용 / 광고 단가 )
  const getViewCountQuery = `
  SELECT SUM(cashFromMarketer)
        / (SELECT unitPrice FROM marketerDebit WHERE marketerId = ?)
      as totalViewCount
  FROM campaignLog as cl
  WHERE campaignId= ? AND type="CPM";`;

  // 총 노출 시간 ( 캠페인로그의 숫자 / 6 ) - 10분당 쌓이기 때문.
  const getTimeQuery = `
  SELECT count(*) / 6 as totalTime
  FROM campaignLog
  WHERE campaignId = ?`;

  // 총 CPC 비용
  const getTotalCpcQuery = `
  SELECT SUM(cashFromMarketer) as totalCPC
  FROM campaignLog
  WHERE campaignId= ? AND type="CPC";`;

  // CPC 총 클릭 수 (홈페이지 이동 + 배너클릭)
  const getClickCountQuery = `
  SELECT SUM(clickCount) as totalClick, SUM(transferCount) as totalTransfer
  FROM landingClick 
  WHERE campaignId = ? `;

  // 총 CPM
  const getWeeksCpmQuery = `
  SELECT SUM(cashFromMarketer) as weeksCPM
  FROM campaignLog as cl
  WHERE campaignId= ?
  AND cl.date > date_add(now(),interval -14 day) 
  AND type="CPM";`;

  const getWeeksViewCountQuery = `
  SELECT SUM(cashFromMarketer) / (SELECT unitPrice FROM marketerDebit WHERE marketerId = ?) as weeksViewCount
  FROM campaignLog as cl
  WHERE campaignId= ?
  AND cl.date > date_add(now(),interval -14 day) 
  AND type="CPM"`;

  const getWeeksTimeQuery = `
  SELECT count(*) / 6 as weeksTime
  FROM campaignLog as cl
  WHERE campaignId = ?
  AND cl.date > date_add(now(),interval -14 day)`;

  const getWeeksCpcQuery = `
  SELECT SUM(cashFromMarketer) as weeksCPC
  FROM campaignLog as cl
  WHERE campaignId= ?
  AND cl.date > date_add(now(),interval -14 day)
  AND type="CPC"`;

  const getWeeksClickCountQuery = `
  SELECT SUM(clickCount) as weeksClick, SUM(transferCount) as weeksTransfer
  FROM landingClick 
  WHERE campaignId = ? 
  AND regiDate > date_add(now(),interval -14 day)`;

  const getMonthsCpmQuery = `
  SELECT SUM(cashFromMarketer) as monthsCPM
  FROM campaignLog as cl
  WHERE campaignId= ?
  AND cl.date > date_add(now(),interval -1 MONTH) 
  AND type="CPM";`;

  const getMonthsViewCountQuery = `
  SELECT SUM(cashFromMarketer)
    / (SELECT unitPrice FROM marketerDebit WHERE marketerId = ?) 
    AS monthsViewCount
  FROM campaignLog as cl
  WHERE campaignId= ?
  AND cl.date > date_add(now(),interval -1 MONTH) 
  AND type="CPM"`;

  const getMonthsTimeQuery = `
  SELECT count(*) / 6  as monthsTime
  FROM campaignLog as cl
  WHERE campaignId = ?
  AND cl.date > date_add(now(),interval -1 MONTH)`;

  const getMonthsCpcQuery = `
  SELECT SUM(cashFromMarketer) as monthsCPC
  FROM campaignLog as cl
  WHERE campaignId= ?
  AND cl.date > date_add(now(),interval -1 MONTH)
  AND type="CPC"`;

  const getMonthsClickCountQuery = `
  SELECT SUM(clickCount) as monthsClick, SUM(transferCount) as monthsTransfer
  FROM landingClick as cl
  WHERE campaignId = ? 
  AND regiDate > date_add(now(),interval -1 MONTH)`;

  Promise.all([
    doQuery(getCampaignNameQuery, campaignId), // 캠페인 이름
    doQuery(getTotalCpmQuery, campaignId), // 총 CPM 비용
    doQuery(getViewCountQuery, [marketerId, campaignId]), // 총 노출 수 ( 총 CPM 비용 / 광고 단가 )
    doQuery(getTimeQuery, campaignId), // 총 노출 시간 ( 캠페인로그의 숫자 / 6 ) - 10분당 쌓이기 때문.
    doQuery(getTotalCpcQuery, campaignId), // CPC 총 비용
    doQuery(getClickCountQuery, campaignId), // CPC 총 클릭 수 (홈페이지 이동 + 배너클릭)
    doQuery(getWeeksCpmQuery, campaignId),
    doQuery(getWeeksViewCountQuery, [marketerId, campaignId]),
    doQuery(getWeeksTimeQuery, campaignId),
    doQuery(getWeeksCpcQuery, campaignId),
    doQuery(getWeeksClickCountQuery, campaignId),
    doQuery(getMonthsCpmQuery, campaignId),
    doQuery(getMonthsViewCountQuery, [marketerId, campaignId]),
    doQuery(getMonthsTimeQuery, campaignId),
    doQuery(getMonthsCpcQuery, campaignId),
    doQuery(getMonthsClickCountQuery, campaignId),
  ])
    .then((row) => {
      const result = {};
      row.map((value) => {
        Object.assign(result, value.result[0]);
        return value;
      });
      res.send(result);
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

module.exports = router;
