const express = require('express');
const pool = require('../model/connectionPool');
const router = express.Router();

// 시간순으로 최신으로 정렬하는 함수
function sortRows(rows, sortingValue) {
  const sortingField = sortingValue;
  return rows.sort((a, b) => (b[sortingField] - a[sortingField]))
}

// 크리에이터 
router.get('/creator/income', function(req, res, next) {
  const creatorId = req.query.creatorId;
  
  pool.getConnection((err, conn) => {
    if (err) {
      // 디비 커넥션 오류인 경우
      console.log(err);
      res.json(err);
    } else {
      const DBquery = `SELECT * FROM
      creatorIncome
      JOIN creatorInfo
      ON creatorIncome.creatorId=creatorInfo.creatorId
      WHERE creatorIncome.creatorId="${creatorId}"`;
      conn.query(DBquery, (err, rows, fields) => {
        if (err) {
          // 디비 쿼리 오류인 경우
          console.log(err);
          res.json(err);
        } else {
          // 결과값이 있는 경우
          if (rows.length > 0) {
            let result = sortRows(rows, 'date')[0];
            res.json(result)
          }
        }
        // pool connection 해제
        conn.release();
      });
    }
  })
})

function preprocessingBannerData(result) {
  result = result.map(
    (value, index, array) => {
      value.contractionState === 0 ? value.contractionState = "진행중" : "완료됨";
      value.contractionTime = value.contractionTime.toString();
      return value
    }
  );
  // ['', '', '', ''] 의 형태로 만드는 로직
  return result
}

router.get('/creator/matchedBanner', function(req, res, next) {
  const creatorId = req.query.creatorId;

  pool.getConnection((err, conn) => {
    if (err) {
      // 디비 커넥션 오류인 경우
      console.log(err);
      res.json(err);
    } else {
      const DBquery = `SELECT *
      FROM bannerMatched
      WHERE creatorId="${creatorId}"`;
      conn.query(DBquery, (err, rows, fields) => {
        if (err) {
          // 디비 쿼리 오류인 경우
          console.log(err);
          res.json(err);
        } else {
          // 결과값이 있는 경우
          if (rows.length > 0) {
            let result = sortRows(rows, 'contractionTime');
            preprocessingBannerData(result);

            // res.json(result)
          }
        }
        // pool connection 해제
        conn.release();
      });
    }
  })
})

module.exports = router;