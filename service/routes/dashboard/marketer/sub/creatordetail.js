const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

router.get('/', (req, res) => {
  const infoQuery = `
  SELECT *
  FROM creatorDetail
  left join 
  (
  select creatorId, creatorLogo, creatorName
  from creatorInfo
  )as B
  on creatorDetail.creatorId = B.creatorId
  WHERE viewer > 20
  order by viewer desc`;

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
