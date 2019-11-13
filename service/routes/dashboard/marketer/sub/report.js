const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

router.get('/', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const { campaignId } = req.query;
  console.log(req.query);
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
  WHERE campaignId= ? AND type="CPM";
`;

  const getTimeCountQuery = `
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


  Promise.all([
    doQuery(getCampaignNameQuery, campaignId),
    doQuery(getTotalCpmQuery, campaignId),
    doQuery(getViewCountQuery, [marketerId, campaignId]),
    doQuery(getTimeCountQuery, campaignId),
    doQuery(getTotalCpcQuery, campaignId),
    doQuery(getClickCountQuery, campaignId),
  ])
    .then((row) => {
      data = row.map(value => Object.values(value.result[0]));
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log('reportPage: ', err);
      res.end();
    });
});

router.get('/totalSpendChart', (req, res) => {
  const marketerId = req._passport.session.user.userid;
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
  const weeksTotalQuery = `
  SELECT
    cl.date as date,
    sum(cashFromMarketer) as cash, type
  FROM campaignLog AS cl
  WHERE campaignId = ?
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date ASC
  `;

  const weeksCpmQuery = `
  SELECT
    cl.date as date,
    sum(cashFromMarketer) as cash, type
  FROM campaignLog AS cl
  WHERE campaignId = ?
    AND type="cpm"
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date ASC
  `;
  const weeksCpcQuery = `
  SELECT
    cl.date as date,
    sum(cashFromMarketer) as cash, type
  FROM campaignLog AS cl
  WHERE campaignId = ?
    AND type="cpc"
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date ASC
  `;
  const monthTotalQuery = `
  SELECT
    cl.date as date,
    sum(cashFromMarketer) as cash, type
  FROM campaignLog AS cl
  WHERE campaignId = ?
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date ASC
  `;

  const monthCpmQuery = `
  SELECT
    cl.date as date,
    sum(cashFromMarketer) as cash, type
  FROM campaignLog AS cl
  WHERE campaignId = ?
    AND type="cpm"
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date ASC
  `;
  const monthCpcQuery = `
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
    doQuery(weeksTotalQuery, campaignId),
    doQuery(weeksCpmQuery, campaignId),
    doQuery(weeksCpcQuery, campaignId),
    doQuery(monthTotalQuery, campaignId),
    doQuery(monthCpmQuery, campaignId),
    doQuery(monthCpcQuery, campaignId),
  ])
    .then((row) => {
      const resData = row.map(value => value.result);
      console.log(resData);
      res.send(resData);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});


module.exports = router;
