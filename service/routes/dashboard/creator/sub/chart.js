// import
const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();
// 해당 크리에이터 성과 차트 데이터 조회
// campaignLog
router.get('/', (req, res) => {
  const { creatorId } = req._passport.session.user;
  const { dateRange } = req.query;
  const query = `
  SELECT
    cl.date as date,
    sum(cash) as cash, type
  FROM campaignLog AS cl
  WHERE creatorId = ?
    AND  cl.date >= DATE_SUB(NOW(), INTERVAL ? DAY)
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date DESC
  `;

  const queryArray = [creatorId, dateRange];

  doQuery(query, queryArray)
    .then((row) => { res.send(row.result); })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// 크리에이터의 월별 성과 차트 데이터 조회
// campaignLog
router.get('/monthly', (req, res) => {
  const { creatorId } = req._passport.session.user;

  const query = `
  SELECT 
  date, sum(cash) as cash, type
  FROM campaignLog
  WHERE creatorId = ? AND date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
  GROUP BY DATE_FORMAT(date, "%y년 %m월%"), type
  ORDER BY date DESC`;

  const queryArray = [creatorId];

  doQuery(query, queryArray)
    .then((row) => { res.send(row.result); })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});
module.exports = router;
