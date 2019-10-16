const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

router.get('/', (req, res) => {
  const infoQuery = `
  SELECT 
  categoryName, campaignList
  FROM categoryCampaign`;

  doQuery(infoQuery)
    .then((row) => {
      res.send(row.result);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

module.exports = router;
