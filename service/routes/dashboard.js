const express = require('express');
const pool = require('../model/connectionPool');
const router = express.Router();

/* 크리에이터 수익금 관련 함수 및 라우터 */
// 시간순으로 최신으로 정렬하는 함수
function sortRows(rows, sortingValue) {
  const sortingField = sortingValue;
  return rows.sort((a, b) => (b[sortingField] - a[sortingField]))
}

// 크리에이터 수익금 라우터
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
            result.date = result.date.toLocaleString();
            res.json(result)
          }
        }
        // pool connection 해제
        conn.release();
      });
    }
  })
})

/* 크리에이터 광고 내역 관련 함수 및 라우터 */
// 크리에이터 광고내역 전처리 함수
function preprocessingBannerData(result) {
  if (result) {
    // column preprocessing
    let columns = result[0];
    columns = Object.keys(columns);
    columns = columns.map((col) => {
      col = col.replace("bannerId", "배너")
        .replace("marketerName", "광고주")
        .replace("contractionTime", "첫 게시일")
        .replace("contractionState", "현재 상태")

      return col;
    });

    // dataset preprocessing
    result = result.map(
    (value) => {
      value.contractionState === 0 ? value.contractionState = "진행중" : value.contractionState = "완료됨";
      value.contractionTime = value.contractionTime.toLocaleString();

      value = Object.values(value);
      return value
    }
  );
  return {columns: columns, data: result}
  }
}

// 크리에이터 광고 내역 라우터
router.get('/creator/matchedBanner', function(req, res, next) {
  const creatorId = req.query.creatorId;

  pool.getConnection((err, conn) => {
    if (err) {
      // 디비 커넥션 오류인 경우
      console.log(err);
      res.json(err);
    } else {
      const DBquery = `SELECT 
      bannerId, marketerName, contractionTime, contractionState
      FROM bannerMatched
      JOIN marketerInfo
      ON bannerMatched.marketerId=marketerInfo.marketerId
      WHERE creatorId="${creatorId}"`;
      conn.query(DBquery, (err, rows, fields) => {
        if (err) {
          // 디비 쿼리 오류인 경우
          console.log(err);
          res.json(err);
        } else {
          // 결과값이 있는 경우
          if (rows.length > 0) {
            const result = preprocessingBannerData(
              sortRows(rows, 'contractionTime'));

            res.send(result)
          }
        }
        // pool connection 해제
        conn.release();
      });
    }
  })
})

module.exports = router;