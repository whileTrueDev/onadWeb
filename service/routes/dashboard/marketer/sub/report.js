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
  WHERE campaignId= ? AND type="CPM";
`;

  const getTimeCountQuery = `
  SELECT count(*) 
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
      console.log('connectedcampaign', err);
      res.end();
    });
});

module.exports = router;
