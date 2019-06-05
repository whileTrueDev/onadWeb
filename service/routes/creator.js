// import
const express = require('express');
const pool = require('../model/connectionPool');
const preprocessing = require('../middlewares/preprocessingData/');
const router = express.Router();
const sortRows = preprocessing.sortRows;
const preprocessingBannerData = preprocessing.preprocessingBannerData;

// 크리에이터 수익금 라우터 및 정보조회
router.get('/income', function(req, res, next) {
  const creatorId = req._passport.session.user.creatorId;
  
  pool.getConnection((err, conn) => {
    if (err) {
      // 디비 커넥션 오류인 경우
      console.log(err);
      res.json(err);
    } else {
      const DBquery = `SELECT 
      creatorTotalIncome, creatorReceivable, creatorAccountNumber, creatorIncome.date
      FROM creatorInfo as ci
      JOIN creatorIncome 
      ON ci.creatorId = creatorIncome.creatorId
      WHERE ci.creatorId="${creatorId}"
      ORDER BY date desc
      LIMIT 1`;
      conn.query(DBquery, (err, rows, fields) => {
        if (err) {
          // 디비 쿼리 오류인 경우
          console.log(err);
          conn.release();
          res.json(err);
        } else {
          // 결과값이 있는 경우
          if (rows.length > 0) {
            console.log(rows);
            let result = sortRows(rows, 'date')[0];
            result.date = result.date.toLocaleString();
            conn.release();
            res.json(result)
          }else{
            conn.release();
            res.end();
          }
        }
        // pool connection 해제
      });
    }
  })
})

// 크리에이터 광고 내역 라우터
router.get('/matchedBanner', function(req, res, next) {
  const creatorId = req._passport.session.user.creatorId;

  pool.getConnection((err, conn) => {
    if (err) {
      // 디비 커넥션 오류인 경우
      console.log(err);
      conn.release();
      res.json(err);
    } else {
      const queryState = `
        SELECT br.bannerSrc, mi.marketerId, bm.contractionTime, bm.contractionState
        FROM bannerMatched as bm
        JOIN bannerRegistered as br
        ON SUBSTRING_INDEX(bm.contractionId, '/', 1) = br.bannerId
        JOIN marketerInfo as mi
        ON SUBSTRING_INDEX(br.bannerId, '_', 1) = mi.marketerId
        WHERE contractionId LIKE '%/?/%'}%'
      `;
      const queryArray = [
        creatorId
      ];

      conn.query(queryState, queryArray, (err, rows, fields) => {
        if (err) {
          // 디비 쿼리 오류인 경우
          console.log(err);
          conn.release();
          res.json(err);
        } else {
          // 결과값이 있는 경우
          if (rows.length > 0) {
            const result = preprocessingBannerData(sortRows(rows, 'contractionTime'));
            conn.release();
            res.send(result);
          }else{
            conn.release();
            res.end();
          }
        }
        // pool connection 해제
      
      });
    }
  })
})

// 크리에이터 현재 광고 중 배너
router.route('/currentBanner').get(function(req, res, next){
  const creatorId = req._passport.session.user.creatorId
  //DB연결후 query문을 통한 데이터 삽입 
  pool.getConnection(function(err, conn){
    if(err){ 
        console.log(err)
    }
    const queryState = `
      SELECT mi.marketerName, br.bannerSrc
      FROM bannerMatched as bm

      JOIN bannerRegistered as br
      ON SUBSTRING_INDEX(bm.contractionId, '/', 1) = br.bannerId

      JOIN marketerInfo as mi
      ON SUBSTRING_INDEX(bm.contractionId, '_', 1) = mi.marketerId

      JOIN contractionTimestamp as ct
      ON  ct.contractionId = bm.contractionId
      
      WHERE bm.contractionState = 0
      AND ct.date >= NOW() - INTERVAL 10 MINUTE
      AND bm.contractionId LIKE '%?%'
      ORDER BY ct.date DESC
      LIMIT 1`;
    
    const queryArray = [
      creatorId
    ]
    conn.query(queryState, queryArray, function(err, result, fields){
        if(err){
            console.log(err);
        }
        result = result.map(
          (value) => {
            value = Object.values(value);
            return value
          }
        )
        conn.release();
        res.send(result);
      });
    });
});

// 배너 오버레이 URL 주소 가져오기
router.route('/overlayUrl').get(function(req, res, next){
  const creatorId = req._passport.session.user.creatorId;
  //DB연결후 query문을 통한 데이터 삽입 
    pool.getConnection(function(err, conn){
      if(err){ 
          console.log(err)
      }
      conn.query(`SELECT advertiseUrl, creatorContractionAgreement
        FROM creatorInfo
        WHERE creatorId = ${creatorId}
        `, function(err, result, fields){
          if(err){
              console.log(err);
          }
          if (result.length > 0) {
            conn.release();
            res.send(result[0]);
          }else{
            conn.release();
            res.end();
          }
        });
      });
});
  
// 수익관리 탭의 크리에이터 별 수익금 차트 데이터
router.route('/chartdata').get(function(req, res, next) {
  // creatorId 가져오기
  const creatorId = req._passport.session.user.creatorId;
  const dateRange = req.query.dateRange;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    }
    // 지금으로부터 30일 이전의 데이터까지만 불러와 응답.
    // 30일간의 모든 데이터를 보낸 뒤, 프론트에서 일별, 주별 분기처리
    const DBquery = `SELECT
    creatorTotalIncome, creatorReceivable, DATE_FORMAT(date, '%m-%d') as date
    FROM creatorIncome
    JOIN (
      SELECT 
      MAX(date) as d1
      FROM creatorIncome
      WHERE creatorId = ${creatorId}
      AND date >= DATE_SUB(NOW(), INTERVAL ${dateRange} DAY)
      GROUP BY DATE_FORMAT(date, '%y%m%d')
    ) tmp
    ON creatorIncome.date = tmp.d1
    ORDER BY tmp.d1 asc
    `
    conn.query(`SELECT creatorAccountNumber FROM creatorInfo WHERE creatorId = ?`, [creatorId], function(err, rows, fields){
      if(err){
        console.log(err);
      }
      if(rows[0].creatorAccountNumber === null){
        console.log('계좌번호가 존재하지 않습니다');
      }else{
        console.log('계좌번호가 존재합니다.');
      }
      const result = {
        creatorAccountNumber : rows[0].creatorAccountNumber,
        totalIncomeData: [],
        receivableData: [],
        labels: [],
      };
      conn.query(DBquery, function(err, rows, filed) {
        if (err) {
          console.log(err);
        }
        if (rows.length > 0) {
          rows = sortRows(rows, 'date', 'asc');
          rows.map((row) => {
            result.totalIncomeData.push(row.creatorTotalIncome);
            result.receivableData.push(row.creatorReceivable);
            result.labels.push(row.date);
          });
          conn.release();
          res.send(result);
        }else{
          conn.release();
          res.end();
        }
      })
    })
  })
})

// 계좌정보를 입력했는지
router.route('/account').get(function(req, res, next) {
  const creatorId = req._passport.session.user.creatorId;
  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    } else {
      conn.query(`SELECT creatorAccountNumber
        FROM creatorInfo
        WHERE creatorId = ${creatorId}
        LIMIT 1
        `, function(err, result, fields){
          if(err){
              console.log(err);
          }
          if (result.length > 0) {
            conn.release();
            res.send(result[0]);
          }else{
            conn.release();
            res.end();
          }
      });
    }
  })
})


router.route('/contraction')
  .post((req, res, next) => {
    const creatorId = req.body.creatorId;
    console.log(creatorId);

    pool.getConnection(function(err, conn){
      if(err){ 
        console.log(err);
      }
      const updateQuery = `
      UPDATE creatorInfo
      SET creatorContractionAgreement = ?
      WHERE creatorInfo.creatorId = ?`;
      const updateArray = [1, creatorId];
      conn.query(updateQuery, updateArray, function(err, result, fields){
        if (err) {
          console.log(err);
        }
        if(result[0]){
          res.send(true);
        } else {
          res.send(false);
        }
      });
      conn.release();
    });
  })


// 마케터 광고 잔액 정보
router.route('/withdrawal').post(function(req, res, next) {
  const creatorId = req._passport.session.user.creatorId;
  const withdrawlAmount = req.body.withdrawalAmount;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    } else {
      // 출금 신청 데이터 넣기
      const queryState = `
      INSERT
      INTO creatorWithdrawal
      (creatorId, creatorWithdrawalAmount, withdrawalState)
      VALUES (?, ?, ?)`;
      
      const queryArray = [
        creatorId, withdrawlAmount, 0
      ];

      conn.query(queryState, queryArray, function(err, result, fields){
          if(err){
            console.log('크리에이터 출금 정보 입력 오류', err);
          }
      });

      // 출금 신청 금액에 맞추어 출금 가능 금액 수정하여 삽입하는 쿼리
      const updateQueryState = `
        INSERT INTO
        creatorIncome (creatorId, creatorTotalIncome, creatorReceivable)
        SELECT creatorId, creatorTotalIncome, creatorReceivable - ?
        FROM creatorIncome
        WHERE creatorId = ?
        ORDER BY date DESC
        LIMIT 1`
      const updateQueryArray = [
        withdrawlAmount, creatorId
      ];

      conn.query(updateQueryState, updateQueryArray, function(err, result, fields){
        if(err){
          console.log('크리에이터 출금신청 금액 수정삽입 오류', err);
        }
        res.send({
          insertWithdrawalSuccess: 'success',
          updateIncome: 'success'
        });
        conn.release();
    });
    }
  })
})

module.exports = router;