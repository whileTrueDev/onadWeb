// import
const express = require('express');
const pool = require('../model/connectionPool');
const doQuery = require('../model/doQuery');
const preprocessing = require('../middlewares/preprocessingData/');
const router = express.Router();
const sortRows = preprocessing.sortRows;
const listOfWithdrawal = preprocessing.withdrawalList;
const preprocessingBannerData = preprocessing.preprocessingBannerData;


// 크리에이터 수익금 라우터 및 정보조회
// doQuery 완료.
router.get('/income', function(req, res, next) {
  const creatorId = req._passport.session.user.creatorId;
  const dataQuery = `
  SELECT 
  creatorTotalIncome, creatorReceivable, creatorAccountNumber, creatorIncome.date
  FROM creatorInfo as ci
  JOIN creatorIncome 
  ON ci.creatorId = creatorIncome.creatorId
  WHERE ci.creatorId= ? 
  ORDER BY date desc
  LIMIT 1`;

  doQuery(dataQuery, [creatorId])
  .then((row)=>{
    const result = row.result[0];
    result.date = result.date.toLocaleString();
    res.json(result);
  })
  .catch((errorData)=>{
    console.log(errorData);
    res.end();
  })
})

// 크리에이터 광고 내역 라우터
// doQuery 완료.
router.get('/matchedBanner', function(req, res, next) {
  const creatorId = req._passport.session.user.creatorId;
  const bannerQuery = `
  SELECT bm.contractionTime, mi.marketerName, bm.contractionState, br.bannerSrc
  FROM bannerMatched as bm
  JOIN bannerRegistered as br 
  ON SUBSTRING_INDEX(bm.contractionId, '/', 1) = br.bannerId
  JOIN marketerInfo as mi
  ON SUBSTRING_INDEX(br.bannerId, '_', 1) = mi.marketerId
  WHERE contractionId LIKE '%?%'
  ORDER BY contractionTime DESC
  `;
  doQuery(bannerQuery, [creatorId])
  .then((row)=>{    
    const result = preprocessingBannerData(row.result);
    res.send(result);
  })
  .catch((errorData)=>{
    console.log(errorData);
    res.end();
  })
})

// 크리에이터 현재 광고 중 배너
// doQuery 완료.
router.get('/currentBanner', function(req, res, next){
  const creatorId = req._passport.session.user.creatorId
  //DB연결후 query문을 통한 데이터 삽입 
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

  doQuery(queryState, [creatorId])
  .then((row)=>{
    const result = row.result.map((value) => 
      {
        value = Object.values(value);
        return value
      }
    )
    res.send(result);
  })
  .catch((errorData)=>{
    console.log(errorData);
    res.end();
  })
});

// 배너 오버레이 URL 주소 가져오기
// doQuery 완료.
router.get('/overlayUrl', function(req, res, next){
  const creatorId = req._passport.session.user.creatorId;
  const urlQuery = `
  SELECT advertiseUrl, creatorContractionAgreement
  FROM creatorInfo
  WHERE creatorId = ?
  `
  doQuery(urlQuery, [creatorId])
  .then((row)=>{
    res.send(row.result[0]);
  })
  .catch(()=>{
    res.end();
  })
});


// 수익관리 탭의 크리에이터 별 수익금 차트 데이터
//doQuery 완료
router.get('/chartdata', function(req, res, next) {
  // creatorId 가져오기
  const creatorId = req._passport.session.user.creatorId;
  const dateRange = req.query.dateRange;
  const rangeQuery = `
  SELECT
  creatorTotalIncome, creatorReceivable, DATE_FORMAT(date, '%m-%d') as date
  FROM creatorIncome
  JOIN (
    SELECT 
    MAX(date) as d1
    FROM creatorIncome
    WHERE creatorId = ?
    AND date >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY DATE_FORMAT(date, '%y%m%d')
  ) tmp
  ON creatorIncome.date = tmp.d1
  ORDER BY tmp.d1 ASC
  `;

  const accountQuery = `
  SELECT creatorAccountNumber 
  FROM creatorInfo 
  WHERE creatorId = ?`;

  doQuery(accountQuery, [creatorId])
  .then((row)=>{
    doQuery(rangeQuery, [creatorId, dateRange])
    .then((inrows)=>{
      const result = {
        creatorAccountNumber : row.result[0].creatorAccountNumber,
        totalIncomeData: [],
        receivableData: [],
        labels: [],
      };
      if (inrows.result.length > 0) {
        inrows.result.map((inrow) => {
          result.totalIncomeData.push(inrow.creatorTotalIncome);
          result.receivableData.push(inrow.creatorReceivable);
          result.labels.push(inrow.date);
        });
        res.send(result);
      }else{
        res.end();
      }
    })
    .catch((errorData)=>{
      console.log(errorData);
      res.end();
    })
  })
  .catch((errorData)=>{
    console.log(errorData);
    res.end();
  })

  // doQuery(rangeQuery, [creatorId, dateRange])
  // pool.getConnection((err, conn) => {
  //   if (err) {
  //     console.log(err)
  //   }
  //   // 지금으로부터 30일 이전의 데이터까지만 불러와 응답.
  //   // 30일간의 모든 데이터를 보낸 뒤, 프론트에서 일별, 주별 분기처리
  //   const DBquery = `SELECT
  //   creatorTotalIncome, creatorReceivable, DATE_FORMAT(date, '%m-%d') as date
  //   FROM creatorIncome
  //   JOIN (
  //     SELECT 
  //     MAX(date) as d1
  //     FROM creatorIncome
  //     WHERE creatorId = ${creatorId}
  //     AND date >= DATE_SUB(NOW(), INTERVAL ${dateRange} DAY)
  //     GROUP BY DATE_FORMAT(date, '%y%m%d')
  //   ) tmp
  //   ON creatorIncome.date = tmp.d1
  //   ORDER BY tmp.d1 asc
  //   `
  //   conn.query(`SELECT creatorAccountNumber FROM creatorInfo WHERE creatorId = ?`, [creatorId], function(err, rows, fields){
  //     if(err){
  //       console.log(err);
  //     }
  //     if(rows[0].creatorAccountNumber === null){
  //       console.log('계좌번호가 존재하지 않습니다');
  //     }else{
  //       console.log('계좌번호가 존재합니다.');
  //     }
  //     const result = {
  //       creatorAccountNumber : rows[0].creatorAccountNumber,
  //       totalIncomeData: [],
  //       receivableData: [],
  //       labels: [],
  //     };
  //     conn.query(DBquery, function(err, rows, filed) {
  //       if (err) {
  //         console.log(err);
  //       }
  //       if (rows.length > 0) {
  //         rows = sortRows(rows, 'date', 'asc');
  //         rows.map((row) => {
  //           result.totalIncomeData.push(row.creatorTotalIncome);
  //           result.receivableData.push(row.creatorReceivable);
  //           result.labels.push(row.date);
  //         });
  //         conn.release();
  //         res.send(result);
  //       }else{
  //         conn.release();
  //         res.end();
  //       }
  //     })
  //   })
  // })
})

// creator contraction Update
//doQuery 완료
router.post('/contraction', (req, res, next) => {
  const creatorId = req._passport.session.user.creatorId;
  const updateQuery = `
  UPDATE creatorInfo
  SET creatorContractionAgreement = ?
  WHERE creatorInfo.creatorId = ?`;

  doQuery(updateQuery, [1, creatorId])
  .then(()=>{
    res.send(true);
  })
  .catch(()=>{
    res.end();
  })
})

// 크리에이터 출금신청 / 출금신청 금액만큼 creatorIncome에서 제외
//doQuery 완료
router.post('/withdrawal', function(req, res, next) {
  const creatorId = req._passport.session.user.creatorId;
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
  LIMIT 1`

  Promise.all([
    doQuery(creatorWithdrawalQuery, [creatorId, withdrawlAmount, 0]), 
    doQuery(creatorIncomeQuery, [withdrawlAmount, creatorId])
  ])
  .then(()=>{
    res.send({
      error : null
    });
  })
  .catch(()=>{
    res.send({
      error : true
    });
  })
})

//doQuery 완료
router.get('/profile', (req, res)=>{
  const profileQuery = `
  SELECT creatorId, creatorName, creatorIp, creatorMail, creatorAccountNumber, creatorContractionAgreement
  FROM creatorInfo 
  WHERE creatorId = ?`;
  if (req._passport.session === undefined) {
    res.send({
      error : true
    })
  }else{
    const creatorId = req._passport.session.user.creatorId;
    doQuery(profileQuery, [creatorId])
    .then((data)=>{
      const userData = data.result[0];
      userData['creatorLogo'] =  req._passport.session.user.creatorLogo;
      res.send({
        error : false,
        result : userData
      });
    })
    .catch(()=>{
      res.send({
        error : true
      });
    })
  }
})

// 크리에이터 출금 내역 불러오기
//doQuery 완료
router.get('/listOfWithdrawal', function(req, res, next) {
  // creatorID 가져오기
  const creatorId = req._passport.session.user.creatorId;

  const listQuery = `
  SELECT
  date, creatorWithdrawalAmount, withdrawalState
  FROM creatorWithdrawal
  WHERE creatorId= ?
  ORDER BY date DESC
  `;

  doQuery(listQuery, creatorId)
  .then((row)=>{
    if(row.result.length > 0){
      const result = listOfWithdrawal(row.result);
      res.send(result);
    }else{
      res.end();
    }
  })
  .catch((errorData)=>{
    console.log(errorData);
    res.end();
  })
});

module.exports = router;