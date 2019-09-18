const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

// 특정 마케터의 광고캐시 조회
// marketerDebit
router.get('/', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const debitQuery = `
  SELECT cashAmount, DATE_FORMAT(date, '%y년 %m월 %d일 %T') as date
  FROM marketerDebit
  WHERE marketerId = ?
  ORDER BY date DESC
  LIMIT 1`;

  doQuery(debitQuery, [marketerId])
    .then((row) => {
      if (!row.error) {
        res.send(row.result[0]);
      }
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

// 마케터 캐시 충전
// marketerDebit, marketerCharge
router.post('/charge', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const chargeCash = Number(req.body.chargeCash);
  const { chargeType } = req.body;
  console.log(`/marketer/charge - id: ${marketerId} | amount: ${chargeCash}`);

  const currentDebitQuery = `
    SELECT cashAmount
    FROM marketerDebit
    WHERE marketerId = ?
    ORDER BY date DESC
    LIMIT 1
    `;
  const currentDebitArray = [marketerId];

  const cashChargeInsertQuery = `
  INSERT INTO marketerCharge
  (marketerId, cash, type)
  VALUES (?, ?, ?)
  `;
  const cashChargeArray = [marketerId, chargeCash, chargeType];

  const debitUpdateQuery = `
  INSERT INTO marketerDebit
  (marketerId, cashAmount)
  VALUES (?, ?)`;

  /** ********************
   * api call 및 캐시충전 처리 필요
   * ******************* */

  doQuery(currentDebitQuery, currentDebitArray)
    .then((row) => {
      if (!row.error) {
        let currentCashAmount = 0;
        if (row.result[0]) { // 기존에 marketerDebit에 데이터가 있는 경우
          currentCashAmount = Number(row.result[0].cashAmount);
        }
        Promise.all([
          doQuery(cashChargeInsertQuery, cashChargeArray),
          doQuery(debitUpdateQuery, [marketerId, currentCashAmount + chargeCash])
        ])
          .then((secondrow) => {
            // 마케터 캐시 충전 쿼리 완료
            if (!secondrow.error) {
              res.send([true, secondrow.result]);
            }
          })
          .catch((err) => {
            /** ****************
             * 쿼리 오류시 처리 필요
             * *************** */

            console.log(err);
            res.end();
          });
      }
    });
});

// 마케터 캐시 환불 신청.
// marketerRefund
router.post('/refund', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const withdrawCash = Number(req.body.withdrawCash);
  console.log(`/marketer/refund - id: ${marketerId} | amount: ${withdrawCash}`);

  // 현재 마케터의 캐시 보유량 조회
  const currentDebitQuery = `
  SELECT cashAmount
  FROM marketerDebit
  WHERE marketerId = ?
  ORDER BY date DESC
  LIMIT 1`;
  const currentDebitArray = [marketerId];
  // 마케터 캐시 보유량 수정 ( 환불진행한 만큼 차감 )
  const debitUpdateQuery = `
  INSERT INTO marketerDebit
  (marketerId, cashAmount)
  VALUES (?, ?)`;
  // 환불 내역에 데이터 적재
  const refundHistoryInsertQuery = `
  INSERT INTO marketerRefund
  (marketerId, cash, marketerRefund.check)
  VALUES (?, ?, ?)`;
  const refundHistoryInsertArray = [marketerId, Number(withdrawCash), 0];

  doQuery(currentDebitQuery, currentDebitArray)
    .then((row) => {
      if (!row.error) {
        if (row.result[0]) {
          const currentCashAmount = Number(row.result[0].cashAmount);
          Promise.all([
            doQuery(refundHistoryInsertQuery, refundHistoryInsertArray),
            doQuery(debitUpdateQuery, [marketerId, currentCashAmount - withdrawCash])
          ])
            .then((secondrow) => {
            // 마케터 캐시 환불 쿼리 완료
              if (!secondrow.error) {
                res.send([true, secondrow.result]);
              }
            })
            .catch((err) => {
            /** ****************
             * 쿼리 오류시 처리 필요
             * *************** */

              console.log(err);
              res.end();
            });
        }
      }
    });
});

// 마케터 광고캐시 충전 내역 리스트
// { columns: ['날짜', '충전금액', '결제수단'], data: [ [ '19년 07월 06일', '10000', '계좌이체'], [] ] }
router.get('/charge/list', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const selectQuery = `
  SELECT 
    DATE_FORMAT(date, '%y년 %m월 %d일 %T') as date,
    cash, type
  FROM marketerCharge
  WHERE marketerId = ?
  ORDER BY date DESC`;
  const selectArray = [marketerId];

  doQuery(selectQuery, selectArray)
    .then((row) => {
      if (!row.error) {
        const sendArray = [];
        row.result.forEach((obj) => {
          const object = obj;
          object.cash = String(obj.cash);
          sendArray.push(Object.values(object));
        });
        const result = {
          data: sendArray
        };
        res.send(result);
      }
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

// 마케터 광고캐시 환불 내역 리스트


// 마케터 캐시 충전 및 환불 내역
// { columns: [ '날짜', '환불금액' '환불상태' ], data: [ [ '19년 07월 06일', '0', '0', '진행중' ], [] ] }
router.get('/refund/list', (req, res) => {
  // marketerID 가져오기
  const marketerId = req._passport.session.user.userid;
  const selectQuery = `
  SELECT 
    DATE_FORMAT(date, '%y년 %m월 %d일 %T') as date,
    cash, marketerRefund.check
  FROM marketerRefund
  WHERE marketerId = ?
  ORDER BY date DESC`;
  const selectArray = [marketerId];

  doQuery(selectQuery, selectArray)
    .then((row) => {
      if (!row.error) {
        const sendArray = [];
        row.result.forEach((obj) => {
          const object = obj;
          object.cash = String(obj.cash);
          object.check = object.check === 0 ? '진행중' : '완료됨';
          sendArray.push(Object.values(object));
        });

        const result = {
          data: sendArray
        };

        res.send(result);
      }
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

module.exports = router;
