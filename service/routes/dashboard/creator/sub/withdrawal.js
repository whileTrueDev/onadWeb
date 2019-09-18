const express = require('express');
const doQuery = require('../../../../model/doQuery');
const { listOfWithdrawal } = require('../../../../middlewares/preprocessingData/');

const router = express.Router();

// 크리에이터 출금신청 / 출금신청 금액만큼 creatorIncome에서 제외
router.post('/', (req, res) => {
  const { creatorId } = req._passport.session.user;
  const withdrawlAmount = req.body.withdrawalAmount;

  const creatorWithdrawalQuery = `
  INSERT INTO creatorWithdrawal
  (creatorId, creatorWithdrawalAmount, withdrawalState)
  VALUES (?, ?, ?)`;

  const creatorIncomeQuery = `
  INSERT INTO creatorIncome 
  (creatorId, creatorTotalIncome, creatorReceivable)
  SELECT creatorId, creatorTotalIncome, creatorReceivable - ?
  FROM creatorIncome
  WHERE creatorId = ?
  ORDER BY date DESC
  LIMIT 1`;

  Promise.all([
    doQuery(creatorWithdrawalQuery, [creatorId, withdrawlAmount, 0]),
    doQuery(creatorIncomeQuery, [withdrawlAmount, creatorId])
  ])
    .then(() => {
      res.send({
        error: null
      });
    })
    .catch(() => {
      res.send({
        error: true
      });
    });
});

// 크리에이터 출금 내역 불러오기
router.get('/list', (req, res) => {
  // creatorID 가져오기
  const { creatorId } = req._passport.session.user;

  const listQuery = `
  SELECT
  date, creatorWithdrawalAmount, withdrawalState
  FROM creatorWithdrawal
  WHERE creatorId= ?
  ORDER BY date DESC
  `;

  doQuery(listQuery, creatorId)
    .then((row) => {
      if (row.result.length > 0) {
        const result = listOfWithdrawal(row.result);
        res.send(result);
      } else {
        res.end();
      }
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

module.exports = router;
