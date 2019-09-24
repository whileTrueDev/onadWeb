const express = require('express');
const doQuery = require('../model/doQuery');
const preprocessing = require('../middlewares/preprocessingData/');

const { cashlist } = preprocessing;
const CustomDate = require('../middlewares/customDate');

const router = express.Router();

/**
 * **********************************
 *  Marketer Routes
 * **********************************
 */

// doQuery 수정
router.get('/cash', (req, res) => {
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

// doQuery 수정
router.get('/banner', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const bannerListQuery = `
  SELECT bannerId, bannerSrc, bannerCategory, date, confirmState
  FROM bannerRegistered
  WHERE marketerId = ? AND (confirmState = ? OR confirmstate = ?)
  ORDER BY confirmState DESC, date DESC
  LIMIT 5`;

  doQuery(bannerListQuery, [marketerId, 1, 3])
    .then((row) => {
      res.send(row.result);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// bannner manage page banner list 가져오기 위한 query
// doQuery 수정
router.get('/banner/all',(req, res)=>{
  const marketerId = req._passport.session.user.userid;
  const bannerQuery = `SELECT cp.campaignId, br.bannerSrc, confirmState
                        FROM bannerRegistered AS br
                        LEFT JOIN campaign AS cp ON br.bannerId = cp.bannerId
                        WHERE br.marketerId = ?
                        ORDER BY confirmState DESC, date DESC`;
  doQuery(bannerQuery, [marketerId])
  .then((row)=>{
    row.result = row.result.map(
      (value) => {
        value = Object.values(value);
        return value
      }
    )
    res.send([true, row.result]);
  })
  .catch((errorData)=>{
    console.log(errorData);
    res.send([null, errorData]);
  })
})


// doQuery 수정
router.post('/info', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const infoQuery = `
  SELECT 
  marketerId, marketerName, marketerMail, 
  marketerPhoneNum, marketerBusinessRegNum, marketerUserType, marketerContraction 
  FROM marketerInfo 
  WHERE marketerId = ? `;

  doQuery(infoQuery, [marketerId])
    .then((row) => {
      res.send(row.result[0]);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// doQuery 수정
router.post('/info/change', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const { marketerName, marketerMail, marketerPhoneNum } = req.body;
  const updateQuery = `
  UPDATE marketerInfo 
  SET marketerName = ? , marketerMail = ? , marketerPhoneNum = ? 
  WHERE marketerId = ? `;

  doQuery(updateQuery, [marketerName, marketerMail, marketerPhoneNum, marketerId])
    .then(() => {
      res.send(true);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// doQuery 수정
// 확인
router.get('/creatorlist', (req, res) => {
  const listQuery = `
  SELECT ts.streamerName, avg(viewer) as avgViewer
  FROM twitchStream as ts
  JOIN twitchStreamDetail as tsd
  ON tsd.streamId = ts.streamId
  JOIN creatorInfo
  ON creatorInfo.creatorId = ts.streamerId
  WHERE creatorInfo.creatorContractionAgreement = 1
  GROUP BY ts.streamerName
  ORDER BY RAND()`;

  doQuery(listQuery)
    .then((row) => {
      const data = preprocessing.creatorList(row.result);
      res.send(data);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// doQuery 수정
router.get('/advertiseOnOff', (req, res) => {
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
router.post('/advertiseOnOff', (req, res) => {
  const contractionState = req.body.contraction === false ? 0 : 1;
  console.log(contractionState);
  const marketerId = req._passport.session.user.userid;
  const costQuery = `
  SELECT marketerDebit
  FROM marketerCost
  WHERE marketerId = ?
  `;

  const infoQuery = `
  UPDATE marketerInfo
  SET marketerContraction = ?
  WHERE marketerId = ?
  `;
  doQuery(costQuery, [marketerId])
    .then((row) => {
      const debit = row.result[0].marketerDebit;
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

// doQuery 수정
router.post('/bannerStart', (req, res) => {
  const { bannerId, creators } = req.body;
  const dateCode = new CustomDate().getCode();
  const selectQuery = `
  SELECT contractionId
  FROM bannerMatched
  JOIN creatorInfo
  ON creatorName = ?
  WHERE contractionId LIKE CONCAT(?, "/", creatorId, "%")
  AND contractionState = 2
  `;

  const updateQuery = `
  UPDATE bannerMatched
  SET contractionState = 0
  WHERE contractionId = ?
  `;

  const insertQuery = `
  INSERT INTO bannerMatched 
  (contractionId)
  SELECT CONCAT(?, "/", creatorId, "/", ?)
  FROM creatorInfo
  WHERE creatorName = ?
  `;

  const insertLandingClickQuery = `
  INSERT INTO landingClick (clickCount, transferCount, contractionId)
  VALUES (?, ?, ?)`;

  Promise.all(creators.map((creator) => {
    doQuery(selectQuery, [creator, bannerId])
      .then((row) => {
        if (row.result.length !== 0) {
        // 이전에 계약한 경우가 존재할 떄
          return Promise.all([
          // contractionId 생성
            doQuery(updateQuery, [0, row.result[0].contractionId]),
            // landingClick 기본값 생성
            doQuery(insertLandingClickQuery, [0, 0, row.result[0].contractionId])
          ]);
        }
        // 이전에 계약한 배너가 존재하지 않은 경우.
        return doQuery(insertQuery, [bannerId, dateCode, creator]);
      })
      .catch((errorData) => {
        console.log(errorData);
      });
  }))
    .then(() => {
      res.send(true);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send(false);
    });
});

// doQuery 완료
router.post('/bannerStartStateChange', (req, res, next) => {
  const marketerId = req._passport.session.user.userid;
  const { bannerId } = req.body;
  const bannerQuery = `
  UPDATE bannerRegistered
  SET confirmState = ?
  WHERE bannerId = ? AND marketerId = ?
  `;

  doQuery(bannerQuery, [3, bannerId, marketerId])
    .then(() => {
      res.send(true);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send(false);
    });
});

// doQuery 완료
router.post('/bannerStopStateChange', (req, res, next) => {
  const marketerId = req._passport.session.user.userid;
  const { bannerId } = req.body;
  const updateQuery = `
  UPDATE bannerRegistered
  SET confirmState = ?
  WHERE bannerId = ? AND marketerId = ?
  `;
  doQuery(updateQuery, [1, bannerId, marketerId])
    .then(() => {
      res.send(true);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end(false);
    });
});

// doQuery 완료
router.post('/bannerStop', (req, res, next) => {
  const { bannerId, creators } = req.body;
  const selectQuery = ` 
  SELECT creatorId
  FROM creatorInfo
  WHERE creatorName = ?
  `;
  const stopQuery = `
  UPDATE bannerMatched
  SET contractionState = 2
  WHERE contractionId LIKE CONCAT(?, "%")
  AND contractionState = 0
  `;
  console.log(creators);
  Promise.all(creators.map((creator) => {
    doQuery(selectQuery, [creator])
      .then((row) => {
        const contractionId = `${bannerId}/${row.result[0].creatorId}`;
        return doQuery(stopQuery, [contractionId]);
      });
  }))
    .then(() => {
      res.send('success!');
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send(false);
    });
});

// doQuery 완료
router.get('/bannerValue', (req, res, next) => {
  const marketerId = req._passport.session.user.userid;
  const valueQuery = `
  SELECT contractionId,
  SUM(contractionTotalValue) as contractionTotalValue,
  DATE_FORMAT(date, '%m-%d') as date
  FROM contractionValue
  WHERE SUBSTRING_INDEX(contractionId, '_' , 1) = ?
  AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  GROUP BY DATE_FORMAT(date, '%y%m%d')
  ORDER BY DATE_FORMAT(date, '%y%m%d')
  `;
  doQuery(valueQuery, [marketerId])
    .then((row) => {
      const dataSet = [];
      const labels = [];
      row.result.map((data) => {
        dataSet.push(Math.ceil(data.contractionTotalValue));
        labels.push(data.date);
      });
      res.send({ dataSet, labels });
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// doQuery 완료
router.post('/banner/delete', (req, res, next) => {
  const { bannerId } = req.body;
  const bannerQuery = `
  DELETE FROM bannerRegistered 
  WHERE bannerId = ? `;
  doQuery(bannerQuery, [bannerId])
    .then(() => {
      res.send([true, '배너가 성공적으로 삭제되었습니다.']);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send([false, '배너 삭제에 실패하였습니다 잠시후 시도해주세요.']);
    });
});

// doQuery 완료
router.post('/banner/push', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const {
    bannerSrc, bannerDescription, companyDescription, landingUrl
  } = req.body;

  const searchQuery = `
  SELECT bannerId 
  FROM bannerRegistered 
  WHERE marketerId = ?  
  ORDER BY date DESC
  LIMIT 1`;

  const saveQuery = `
  INSERT INTO bannerRegistered 
  (bannerId, marketerId, bannerSrc, bannerDescription, companyDescription, landingUrl) 
  VALUES (?, ?, ?, ?, ?, ?)`;

  doQuery(searchQuery, [marketerId])
    .then((row) => {
    // 이전에 배너를 게시한 적이 있다는 의미.
      let bannerId = '';
      if (row.result[0]) {
        const lastBannerId = row.result[0].bannerId;
        const count = parseInt(lastBannerId.split('_')[1]) + 1;
        if (count < 10) {
          bannerId = `${marketerId}_0${count}`;
        } else {
          bannerId = `${marketerId}_${count}`;
        }
      } else {
        bannerId = `${marketerId}_01`;
      }
      doQuery(saveQuery, [bannerId, marketerId, bannerSrc, bannerDescription, companyDescription, landingUrl])
        .then(() => {
          res.send([true, '배너가 등록되었습니다']);
        })
        .catch(() => {
          res.send([false]);
        });
    })
    .catch(() => {
      res.send([false]);
    });
});

// // 마케터 캐시 충전
// router.post('/chargecash', function(req, res, next) {
//   const marketerId = req._passport.session.user.userid;
//   const { chargecash } = req.body;
//   const insertQuery = `
//   INSERT
//   INTO marketerCash
//   (marketerId, chargeCash, withdrawCash)
//   VALUES (?, ?, ?)`;


//   doQuery(insertQuery, [marketerId, chargecash, 0])
//   .then((row)=>{

//   })
//   pool.getConnection((err, conn) => {
//     if (err) {
//       console.log(err)
//     } else {
//       // 충전 데이터 넣기
//       const queryState = `
//       INSERT
//       INTO marketerCash
//       (marketerId, chargeCash, withdrawCash)
//       VALUES (?, ?, ?)`;

//       const queryArray = [
//         marketerId , chargecash ,0
//       ];

//       conn.query(queryState, queryArray, function(err, result, fields){
//           if(err){
//             console.log('마케터 캐시충전 정보 입력 오류', err);
//           } else {

//             conn.query(`SELECT
//             marketerId
//             FROM marketerCost
//             WHERE marketerId = ?
//             ORDER BY date DESC
//             LIMIT 1`, [marketerId], (err, result)=>{
//               if(err){
//                 console.log(err);
//                 conn.release();
//                 res.send([null, err]);
//               }
//               console.log(result)
//               if (result.length > 0) {
//                 // 광고캐시 신청 금액에 맞추어 기존의 marketerDebit에 추가하기
//                   const updateQueryState = `
//                   INSERT INTO
//                   marketerCost (marketerId, marketerDebit)
//                   SELECT marketerId, marketerDebit + ?
//                   FROM marketerCost
//                   WHERE marketerId = ?
//                   ORDER BY date DESC
//                   LIMIT 1`

//                 const updateQueryArray = [
//                   chargecash, marketerId
//                 ];

//                 conn.query(updateQueryState, updateQueryArray, function(err, result, fields){
//                   if(err){
//                     console.log('마케터 캐시충전 금액 수정삽입 오류', err);
//                   } else {
//                     res.send({
//                       insertDebit: 'success',
//                       updateDebit: 'success'
//                     });
//                     conn.release();
//                   }
//                 });

//               } else {

//                 const updateQueryState = `
//                   INSERT INTO
//                   marketerCost (marketerId, marketerDebit)
//                   VALUES (?, ?)`

//                 const updateQueryArray = [
//                   marketerId, chargecash
//                 ];

//                 conn.query(updateQueryState, updateQueryArray, function(err, result, fields){
//                   if(err){
//                     console.log('마케터 캐시충전 금액 수정삽입 오류', err);
//                   } else {
//                     res.send({
//                       insertDebit: 'success',
//                       updateDebit: 'success'
//                     });
//                     conn.release();
//                   }
//                 });
//               }
//             })
//           }
//       });
//     }
//   })
// })

// // 마케터 캐시 환불
// router.post('/return', function(req, res, next) {
//   const marketerId = req._passport.session.user.userid;
//   const withdrawcash = req.body.withdrawCash;

//   pool.getConnection((err, conn) => {
//     if (err) {
//       console.log(err)
//     } else {
//       // 출금 신청 데이터 넣기
//       const queryState = `
//       INSERT
//       INTO marketerCash
//       (marketerId, chargeCash, withdrawCash)
//       VALUES (?, ?, ?)`;

//       const queryArray = [
//         marketerId, 0, withdrawcash
//       ];

//       conn.query(queryState, queryArray, function(err, result, fields){
//           if(err){
//             console.log('마케터 캐시충전 정보 입력 오류', err);
//           }
//       });

//       // 광고캐시 환불 금액에 맞추어 기존의 marketerDebit에 추가하기
//       const updateQueryState = `
//         INSERT INTO
//         marketerCost (marketerId, marketerDebit)
//         SELECT marketerId, marketerDebit - ?
//         FROM marketerCost
//         WHERE marketerId = ?
//         ORDER BY date DESC
//         LIMIT 1`
//       const updateQueryArray = [
//         withdrawcash, marketerId
//       ];

//       conn.query(updateQueryState, updateQueryArray, function(err, result, fields){
//         if(err){
//           console.log('마케터 캐시충전 금액 수정삽입 오류', err);
//         }
//         res.send({
//           insertDebit: 'success',
//           updateDebit: 'success'
//         });
//         conn.release();
//     });
//     }
//   })
// })

// 마케터 캐시 충전 및 환불 내역
/* 올바른 OUTPUT의 형태
{ columns: [ '날짜', '캐시충전', '캐시환불', '환불상태' ],
  data: [ [ '19년 07월 06일', '0', '0', '진행중' ] ] }
 */
// doQuery 완료
router.get('/cashlist', (req, res, next) => {
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

// 마케터 계좌정보 조회
// doQuery 완료
router.get('/accountNumber', (req, res, next) => {
  const marketerId = req._passport.session.user.userid;
  const accountQuery = `
  SELECT marketerAccountNumber
  FROM marketerInfo
  WHERE marketerId = ?`;
  doQuery(accountQuery, [marketerId])
    .then((row) => {
      const accountNumber = row.result[0].marketerAccountNumber;
      res.send({
        accountNumber
      });
    })
    .catch((error) => {
      console.log(error);
      res.send({});
    });
});

// bannerMatched의 특정 배너와 계약된 크리에이터 조회
// doQuery 완료
router.get('/contraction/creatorList', (req, res, next) => {
  const { bannerId } = req.query;

  const BANNER_ID_INDEX = 1; // contractionId 의 bannerId 부분
  const PAUSED_STATE = 2; // 중단된 배너의 경우만
  const query = `
  SELECT creatorName
  FROM bannerMatched
  JOIN creatorInfo as ci
  ON ci.creatorId = SUBSTRING_INDEX(contractionId, '/', -1)
  WHERE (SUBSTRING_INDEX(contractionId, '/', ?) = ? AND contractionState = ?)`;
  const queryArray = [BANNER_ID_INDEX, bannerId, PAUSED_STATE];

  doQuery(query, queryArray)
    .then((data) => {
      const { error, result } = data;
      if (error) {
        res.send(error);
      }
      if (result.length > 0) {
        const responseData = [];
        result.map((row) => {
          responseData.push((row.creatorName));
        });
        res.send(responseData);
      } else {
        res.send([]);
      }
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send([]);
    });
});


module.exports = router;
