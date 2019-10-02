const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

router.get('/data', (req, res) => {
  const { creatorId } = req._passport.session.user;
  const selectQuery = `
  SELECT 
  SUM(clickCount) as clickCount, 
  SUM(transferCount) as transferCount,
  B.visitCount, 
  C.exp, 
  C.level, 
  C.updateDate AS date 
  FROM landingClick AS A 
  JOIN creatorLanding AS B ON A.creatorId = B.creatorId
  LEFT JOIN creatorRoyaltyLevel AS C ON B.creatorId = C.creatorId 
  WHERE A.creatorId = ?
  `;

  doQuery(selectQuery, [creatorId])
    .then((row) => {
      const data = {
        ...row.result[0],
        date: row.result[0].date.toLocaleString(),
        clickCount: row.result[0].clickCount || 0,
        transferCount: row.result[0].transferCount || 0,
        visitCount: row.result[0].visitCount || 0
      };
      res.send(data);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

module.exports = router;
