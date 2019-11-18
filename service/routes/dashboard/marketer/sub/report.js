const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

router.get('/', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const { campaignId } = req.query;
  let data;
  const getCampaignNameQuery = `
  SELECT campaignName 
  FROM campaign 
  WHERE campaignId=?;
  `;

  const getTotalCpmQuery = `
  SELECT SUM(cashFromMarketer) 
  FROM campaignLog as cl
  WHERE campaignId= ? AND type="CPM";`;

  const getViewCountQuery = `
  SELECT SUM(cashFromMarketer) / (SELECT unitPrice FROM marketerDebit WHERE marketerId = ?)
  FROM campaignLog as cl
  WHERE campaignId= ? AND type="CPM";`;

  const getTimeQuery = `
  SELECT count(*) / 6
  FROM campaignLog
  WHERE campaignId = ?`;

  const getTotalCpcQuery = `
  SELECT SUM(cashFromMarketer) 
  FROM campaignLog
  WHERE campaignId= ? AND type="CPC";`;

  const getClickCountQuery = `
  SELECT SUM(clickCount), SUM(transferCount)
  FROM landingClick 
  WHERE campaignId = ? `;

  const getWeeksCpmQuery = `
  SELECT SUM(cashFromMarketer) 
  FROM campaignLog as cl
  WHERE campaignId= ?
  AND cl.date > date_add(now(),interval -14 day) 
  AND type="CPM";`;

  const getWeeksViewCountQuery = `
  SELECT SUM(cashFromMarketer) / (SELECT unitPrice FROM marketerDebit WHERE marketerId = ?)
  FROM campaignLog as cl
  WHERE campaignId= ?
  AND cl.date > date_add(now(),interval -14 day) 
  AND type="CPM"`;

  const getWeeksTimeQuery = `
  SELECT count(*) / 6
  FROM campaignLog as cl
  WHERE campaignId = ?
  AND cl.date > date_add(now(),interval -14 day)`;

  const getWeeksCpcQuery = `
  SELECT SUM(cashFromMarketer) 
  FROM campaignLog as cl
  WHERE campaignId= ?
  AND cl.date > date_add(now(),interval -14 day)
  AND type="CPC"`;

  const getWeeksClickCountQuery = `
  SELECT SUM(clickCount), SUM(transferCount)
  FROM landingClick 
  WHERE campaignId = ? 
  AND regiDate > date_add(now(),interval -14 day)`;

  const getMonthsCpmQuery = `
  SELECT SUM(cashFromMarketer) 
  FROM campaignLog as cl
  WHERE campaignId= ?
  AND cl.date > date_add(now(),interval -1 MONTH) 
  AND type="CPM";`;

  const getMonthsViewCountQuery = `
  SELECT SUM(cashFromMarketer) / (SELECT unitPrice FROM marketerDebit WHERE marketerId = ?)
  FROM campaignLog as cl
  WHERE campaignId= ?
  AND cl.date > date_add(now(),interval -1 MONTH) 
  AND type="CPM"`;

  const getMonthsTimeQuery = `
  SELECT count(*) / 6
  FROM campaignLog as cl
  WHERE campaignId = ?
  AND cl.date > date_add(now(),interval -1 MONTH)`;

  const getMonthsCpcQuery = `
  SELECT SUM(cashFromMarketer) 
  FROM campaignLog as cl
  WHERE campaignId= ?
  AND cl.date > date_add(now(),interval -1 MONTH)
  AND type="CPC"`;

  const getMonthsClickCountQuery = `
  SELECT SUM(clickCount), SUM(transferCount)
  FROM landingClick as cl
  WHERE campaignId = ? 
  AND regiDate > date_add(now(),interval -1 MONTH)`;

  Promise.all([
    doQuery(getCampaignNameQuery, campaignId),
    doQuery(getTotalCpmQuery, campaignId),
    doQuery(getViewCountQuery, [marketerId, campaignId]),
    doQuery(getTimeQuery, campaignId),
    doQuery(getTotalCpcQuery, campaignId),
    doQuery(getClickCountQuery, campaignId),
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
      data = row.map(value => Object.values(value.result[0]));
      res.send(data);
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


module.exports = router;
