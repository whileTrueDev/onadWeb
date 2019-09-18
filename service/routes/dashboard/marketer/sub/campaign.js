const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();


// doQuery 수정
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

// doQuery 수정
// 잔액이 0원일 때는 불가능 하도록 정의.
router.post('/onoff', (req, res) => {
  const contractionState = req.body.contraction === false ? 0 : 1;
  console.log(contractionState);
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

module.exports = router;
