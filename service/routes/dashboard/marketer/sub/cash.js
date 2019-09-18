const express = require('express');
const doQuery = require('../../../../model/doQuery');
const { cashlist } = require('../../../../middlewares/preprocessingData/');

const router = express.Router();

// doQuery 수정
router.get('/', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const debitQuery = `
  SELECT marketerDebit, 
  DATE_FORMAT(date, '%y년 %m월 %d일 %T') as date
  FROM marketerCost
  WHERE marketerId = ?
  ORDER BY date DESC
  LIMIT 1`;

  doQuery(debitQuery, [marketerId])
    .then((row) => {
      res.send(row.result[0]);
    })
    .catch(() => {
      res.end();
    });
});

// 마케터 캐시 충전
router.post('/charge', (req, res, next) => {
  const marketerId = req._passport.session.user.userid;
  const { chargecash } = req.body;
  const insertQuery = `
  INSERT
  INTO marketerCash
  (marketerId, chargeCash, withdrawCash)
  VALUES (?, ?, ?)`;

  // 캐시 충전
  doQuery(insertQuery, [marketerId, chargecash, 1])
    .then((row) => {
      //
    })
    .catch((err) => {
      res.send([false]);
    });
  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err);
    } else {
      // 충전 데이터 넣기
      const queryState = `
      INSERT
      INTO marketerCash
      (marketerId, chargeCash, withdrawCash)
      VALUES (?, ?, ?)`;

      const queryArray = [
        marketerId, chargecash, 0
      ];

      conn.query(queryState, queryArray, (err, result, fields) => {
        if (err) {
          console.log('마케터 캐시충전 정보 입력 오류', err);
        } else {
          conn.query(`SELECT
            marketerId
            FROM marketerCost
            WHERE marketerId = ?
            ORDER BY date DESC
            LIMIT 1`, [marketerId], (err, result) => {
            if (err) {
              console.log(err);
              conn.release();
              res.send([null, err]);
            }
            console.log(result);
            if (result.length > 0) {
              // 광고캐시 신청 금액에 맞추어 기존의 marketerDebit에 추가하기
              const updateQueryState = `
                  INSERT INTO
                  marketerCost (marketerId, marketerDebit)
                  SELECT marketerId, marketerDebit + ?
                  FROM marketerCost
                  WHERE marketerId = ?
                  ORDER BY date DESC
                  LIMIT 1`;

              const updateQueryArray = [
                chargecash, marketerId
              ];

              conn.query(updateQueryState, updateQueryArray, (err, result, fields) => {
                if (err) {
                  console.log('마케터 캐시충전 금액 수정삽입 오류', err);
                } else {
                  res.send({
                    insertDebit: 'success',
                    updateDebit: 'success'
                  });
                  conn.release();
                }
              });
            } else {
              const updateQueryState = `
                  INSERT INTO
                  marketerCost (marketerId, marketerDebit)
                  VALUES (?, ?)`;

              const updateQueryArray = [
                marketerId, chargecash
              ];

              conn.query(updateQueryState, updateQueryArray, (err, result, fields) => {
                if (err) {
                  console.log('마케터 캐시충전 금액 수정삽입 오류', err);
                } else {
                  res.send({
                    insertDebit: 'success',
                    updateDebit: 'success'
                  });
                  conn.release();
                }
              });
            }
          });
        }
      });
    }
  });
});

// 마케터 캐시 환불
router.post('/refund', (req, res, next) => {
  const marketerId = req._passport.session.user.userid;
  const withdrawcash = req.body.withdrawCash;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err);
    } else {
      // 출금 신청 데이터 넣기
      const queryState = `
      INSERT
      INTO marketerCash
      (marketerId, chargeCash, withdrawCash)
      VALUES (?, ?, ?)`;

      const queryArray = [
        marketerId, 0, withdrawcash
      ];

      conn.query(queryState, queryArray, (err, result, fields) => {
        if (err) {
          console.log('마케터 캐시충전 정보 입력 오류', err);
        }
      });

      // 광고캐시 환불 금액에 맞추어 기존의 marketerDebit에 추가하기
      const updateQueryState = `
        INSERT INTO
        marketerCost (marketerId, marketerDebit)
        SELECT marketerId, marketerDebit - ?
        FROM marketerCost
        WHERE marketerId = ?
        ORDER BY date DESC
        LIMIT 1`;
      const updateQueryArray = [
        withdrawcash, marketerId
      ];

      conn.query(updateQueryState, updateQueryArray, (err, result, fields) => {
        if (err) {
          console.log('마케터 캐시충전 금액 수정삽입 오류', err);
        }
        res.send({
          insertDebit: 'success',
          updateDebit: 'success'
        });
        conn.release();
      });
    }
  });
});

// 마케터 캐시 충전 및 환불 내역
/* 올바른 OUTPUT의 형태
{ columns: [ '날짜', '캐시충전', '캐시환불', '환불상태' ],
  data: [ [ '19년 07월 06일', '0', '0', '진행중' ] ] }
 */
router.get('/refund/list', (req, res, next) => {
  // marketerID 가져오기
  const marketerId = req._passport.session.user.userid;
  const listQuery = `
  SELECT
  DATE_FORMAT(date, '%y년 %m월 %d일') as date, chargeCash, 
  withdrawCash, cashReturnState
  FROM marketerCash
  WHERE marketerId = ?
  ORDER BY date DESC`;

  doQuery(listQuery, [marketerId])
    .then((row) => {
      const result = cashlist(row.result);
      res.send(result);
    })
    .catch(() => {
      res.end();
    });
});

module.exports = router;
