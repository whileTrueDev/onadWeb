const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();


// 캠페인 온오프 조회
router.get('/onoff', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const contractionQuery = `
  SELECT marketerContraction
  FROM marketerInfo
  WHERE marketerId = ?
  `;

  doQuery(contractionQuery, [marketerId])
    .then((row) => {
      const data = row.result[0].marketerContraction === 1;
      res.send(data);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send(false);
    });
});

// 캠페인 On & Off 기능
// 잔액이 0원일 때는 불가능 하도록 정의.
router.post('/onoff', (req, res) => {
  const contractionState = req.body.contraction === false ? 0 : 1;
  const marketerId = req._passport.session.user.userid;
  const costQuery = `
  SELECT cashAmount
  FROM marketerDebit
  WHERE marketerId = ?
  `;

  const infoQuery = `
  UPDATE marketerInfo
  SET marketerContraction = ?
  WHERE marketerId = ?
  `;
  doQuery(costQuery, [marketerId])
    .then((row) => {
      const debit = row.result[0].cashAmount;
      if (debit === 0) {
        res.send(false);
      } else {
        doQuery(infoQuery, [contractionState, marketerId])
          .then(() => {
            res.send(true);
          })
          .catch((errorData) => {
            console.log(errorData);
            res.send(false);
          });
      }
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send(false);
    });
});

// 해당 마케터의 성과 차트 데이터 조회
// contractionValue
router.get('/chart', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const query = `
  SELECT
    cl.date as date,
    sum(cash) as cash, type
  FROM campaignLog AS cl
  WHERE SUBSTRING_INDEX(cl.campaignId, '_', 1) = ?
    AND  cl.date >= DATE_SUB(NOW(), INTERVAL 14 DAY)
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date DESC
  `;
  const queryArray = [marketerId];

  doQuery(query, queryArray)
    .then((row) => {
      /**
       * 필요 데이터 셋:
       * labels: [ '9월 9일', ... ]
       * dataSet: [ ... ]
       */
      res.send(row.result);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});


module.exports = router;
