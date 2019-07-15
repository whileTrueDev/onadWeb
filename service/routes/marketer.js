const express = require('express');
const pool = require('../model/connectionPool');
const doQuery = require('../model/doQuery');
const preprocessing = require('../middlewares/preprocessingData/');
const cashlist = preprocessing.cashlist;
const router = express.Router();

/**
 * **********************************
 *  Marketer Routes
 * **********************************
 */

router.get('/cash', function(req, res, next) {
  const marketerId = req._passport.session.user.userid;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    } else {
      // 출금 신청 데이터 넣기
      const queryState = `
      SELECT marketerDebit, 
            DATE_FORMAT(date, '%y년 %m월 %d일') as date
      FROM marketerCost
      WHERE marketerId = ?
      ORDER BY date DESC
      LIMIT 1`;

      const queryArray = [
        marketerId
      ];

      conn.query(queryState, queryArray, function(err, result, fields){
          if(err){
            console.log('마케터 광고캐시 조회 오류', err);
          }
          if (result.length > 0) {
            conn.release();
            res.send(result[0]);
          } else {
            conn.release();
            res.end();
          }
      });
  }})
})

router.get('/banner', function(req, res, next) {
  const marketerId = req._passport.session.user.userid;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    } else {
      // 출금 신청 데이터 넣기
      const queryState = `
      SELECT bannerId, bannerSrc, bannerCategory, date, confirmState
      FROM bannerRegistered
      WHERE marketerId = ? AND (confirmState = ? OR confirmstate = ?)
      ORDER BY confirmState DESC, date DESC
      LIMIT 5`;

      const queryArray = [
        marketerId, 1, 3 // 1: valid 이, 3: now is broadcasted banner
      ];

      conn.query(queryState, queryArray, function(err, result, fields){
          if(err){
            console.log('마케터 배너데이터 조회 오류', err);
          } else {
            if (result.length > 0) {
              conn.release();
              res.send(result);
            } else {
              conn.release();
              res.send(result);
            }
          }
      });
  }})
})

// bannner manage page banner list 가져오기 위한 query
router.get('/banner/all',(req, res, next)=>{
  const marketerId = req._passport.session.user.userid;
  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      res.send([null, err]);
    } else {
      const queryState = `
      SELECT bannerId, bannerSrc, bannerCategory, date, confirmState, bannerDenialReason
      FROM bannerRegistered
      WHERE marketerId = ?
      ORDER BY date DESC`;
      conn.query(queryState, [marketerId], function(err, result, fields){
        if(err){
          conn.release();
          res.send([null, err]);
        }
        else{
          conn.release();
          res.send([true, result]);
        }
      })
    }
  })
})

router.post('/info', (req, res, next)=> {
  const marketerId = req._passport.session.user.userid;
  pool.getConnection((err, conn) => {
    if(err){
      conn.release();
      res.send(err);
    }
    conn.query(`SELECT marketerId, marketerName, marketerMail, marketerPhoneNum, marketerBusinessRegNum, marketerUserType, marketerContraction FROM marketerInfo WHERE marketerId = ? `, [marketerId], (err, result)=>{
      conn.release();
      res.send(result[0]);
    })
  })
})

router.post('/info/change', (req, res, next)=> {
  const marketerId = req._passport.session.user.userid;
  const {marketerName, marketerMail, marketerPhoneNum} = req.body;
  pool.getConnection((err, conn) => {
    if(err){
      conn.release();
      res.send(err);
    }
    conn.query(`UPDATE marketerInfo SET marketerName = ? , marketerMail = ? , marketerPhoneNum = ? WHERE marketerId = ? `, [marketerName, marketerMail, marketerPhoneNum, marketerId], (err, result)=>{
      conn.release();
      res.send(false);
    })
  })
})

router.get('/creatorlist', function(req, res, next) {

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    } else {
      
      let data = null;

      const queryState = `
      SELECT creatorName
      FROM creatorInfo
      LIMIT 10`;

      conn.query(queryState, function(err, result, fields){
          if(err){
            console.log('마케터 광고캐시 조회 오류', err);
          }
          if (result.length > 0) {
            data = result;
            
            if (data !== null) {
              const queryState1 = `
              SELECT ts.streamerName, avg(viewer) as avgViewer
              FROM twitchStream as ts
              JOIN twitchStreamDetail as tsd
              ON tsd.streamId = ts.streamId
              JOIN creatorInfo
              ON creatorInfo.creatorId = ts.streamerId
              GROUP BY ts.streamerName`;
      
            conn.query(queryState1, function(err, result, fields){
              if(err){
                console.log('추천 크리에이터 평균 시청자 수 조회 오류', err);
                conn.release();
              }
              conn.release();
              const data = preprocessing.creatorList(result);
              res.send(data);
            });
            }
          }
      });

  }})
})

router.get('/advertiseOnOff', function(req, res, next) {
  const marketerId = req._passport.session.user.userid;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    } else {
      // 출금 신청 데이터 넣기
      const queryState = `
        SELECT marketerContraction
        FROM marketerInfo
        WHERE marketerId = ?
      `;

      const queryArray = [
        marketerId
      ];

      conn.query(queryState, queryArray, function(err, result, fields){
          if(err){
            console.log('마케터 광고 시작 토글 조회 오류', err);
          }
          if (result.length > 0) {
            conn.release();
            // 1: 광고 ON, 0: 광고 OFF
            result[0].marketerContraction === 1
              ? result[0].marketerContraction = true
              : result[0].marketerContraction = false
            res.send(result[0]);
          } else {
            conn.release();
            res.end();
          }
      });
  }})
})

router.post('/advertiseOnOff', function(req, res, next) {
  let contractionState = req.body.contraction;
  contractionState === false ? contractionState = 0 : contractionState = 1;
  const marketerId = req._passport.session.user.userid;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    } else {
      // 출금 신청 데이터 넣기
      const queryState = `
        UPDATE marketerInfo
        SET marketerContraction = ?
        WHERE marketerId = ?`;

      const queryArray = [
        contractionState, marketerId
      ];

      conn.query(queryState, queryArray, function(err, result, fields){
          if(err){
            console.log('마케터 광고 ON/OFF 업데이트 오류', err);
          } else {
            conn.release();
            console.log('마케터 광고 ON/OFF', result);
            res.send('success');
          }
      });
  }})
})

router.post('/bannerStart', function(req, res, next) {
  const marketerId = req._passport.session.user.userid;
  const { bannerId, creators } = req.body;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    } else {
      const queryState1 = `SELECT contractionId
        FROM bannerMatched
        JOIN creatorInfo
        ON creatorName = ?
        WHERE contractionId = CONCAT(?, "/", creatorId)
      `;
      // 모든 크리에이터를 한번씩
      creators.map((creatorName) => {
        const queryArray1 = [ creatorName, bannerId ];
        conn.query(queryState1, queryArray1, function(err, result, fields) {
          // 이미 이 배너와 크리에이터의 contraction이 존재할 때
          if (result.length > 0) {
            // state를 0으로 수정한다 (0: 광고 진행중)
            const updateStateQuery = `
              UPDATE bannerMatched
              SET contractionState = ?
              WHERE contractionId = ?
            `;
            const updateStateArray = [0, result[0].contractionId]
            conn.query(updateStateQuery, updateStateArray, function(err, result, fields) {
              if (err) {
                console.log('contraction 스테이트 수정 오류', err)
              } else {
                console.log(`contraction 스테이트 수정 : ${creatorName}, ${result.message}`);
              }
            })
          }
          // 이 배너와 크리에이터의 contraction이 기존에 존재하지 않는 경우
          else {
            // Insert Contractions
            const insertQeury = `
              INSERT INTO bannerMatched (contractionId)
              SELECT CONCAT(?, "/", creatorId)
              FROM creatorInfo
              WHERE creatorName = ?
            `;
            const insertArray = [bannerId, creatorName];
            conn.query(insertQeury, insertArray, function(err, result, fields) {
              if (err) {
                console.log('contraction 인서트 오류', err);
              } else {
                console.log(`contraction 인서트 : ${creatorName}, ${result.message}`)
              }
            })
          }
        })
      })
      conn.release();
      res.send("sucess!");
  }})
})

router.post('/bannerStartStateChange', function(req, res, next) {
  const marketerId = req._passport.session.user.userid;
  const { bannerId } = req.body;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    } else {
      const queryState = `
        UPDATE bannerRegistered
        SET confirmState = ?
        WHERE bannerId = ? AND marketerId = ?
      `;
      const queryArray = [3, bannerId, marketerId]; // 3: 광고 중 상태
      conn.query(queryState, queryArray, function(err, result, fields) {
        if (err) {
          console.log('배너 시작 시 배너 스테이트 변경 오류', err)
        }
      })
      conn.release();
      res.send("success");
  }})
})

router.post('/bannerStop', function(req, res, next) {
  const { bannerId, creators } = req.body;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    } else {
      const queryState1 = `
        SELECT contractionId
        FROM bannerMatched
        JOIN creatorInfo
        ON creatorName = ?
        WHERE contractionId = CONCAT(?, "/", creatorId)
      `;
      // 모든 크리에이터를 한번씩
      creators.map((creatorName) => {
        const queryArray1 = [ creatorName, bannerId ];
        conn.query(queryState1, queryArray1, function(err, result, fields) {
          // 이미 이 배너와 크리에이터의 contraction이 존재할 때
          if (result.length > 0) {
            // state를 2으로 수정한다 (2: 광고 중단됨)
            const updateStateQuery = `
              UPDATE bannerMatched
              SET contractionState = ?
              WHERE contractionId = ?
            `;
            const updateStateArray = [2, result[0].contractionId]
            conn.query(updateStateQuery, updateStateArray, function(err, result, fields) {
              if (err) {
                console.log('Stop contraction 스테이트 수정 오류', err)
              } 
            })
          }
        })
      })
      conn.release();
      res.send("sucess!");
  }})
})

router.post('/bannerStopStateChange', function(req, res, next) {
  const marketerId = req._passport.session.user.userid;
  const { bannerId } = req.body;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    } else {
      const queryState = `
        UPDATE bannerRegistered
        SET confirmState = ?
        WHERE bannerId = ? AND marketerId = ?
      `;
      const queryArray = [1, bannerId, marketerId]; // 1: 승인됨 (광고대기)
      conn.query(queryState, queryArray, function(err, result, fields) {
        if (err) {
          console.log('배너 중단 시 배너 스테이트 변경 오류', err)
        }
      })
      conn.release();
      res.send("success");
  }})
})

router.get('/bannerValue', function(req, res, next) {
  const marketerId = req._passport.session.user.userid;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    } else {
      const queryState = `
        SELECT contractionId,
          SUM(contractionTotalValue) as contractionTotalValue,
          DATE_FORMAT(date, '%m-%d') as date
        FROM contractionValue
        WHERE contractionId LIKE CONCAT('%', ?, '%')
        AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE_FORMAT(date, '%y%m%d')
        ORDER BY DATE_FORMAT(date, '%y%m%d')
      `;
      const queryArray = [marketerId];
      conn.query(queryState, queryArray, function(err, result, fields) {
        if (err) {
          console.log('배너 수익 / 비용 결과 select 오류', err)
        } else {
          console.log(result)
          conn.release();

          const dataSet = [];
          const labels = [];
          if (result.length > 0) {
            result.map((data) => {
              dataSet.push(Math.ceil(data.contractionTotalValue));
              labels.push(data.date);
            })
  
            res.send({dataSet, labels});
          }
        }
        res.end();
      })
  }})
})

router.post('/banner/delete', (req, res, next)=>{
  const {bannerId} = req.body;
  console.log(bannerId);
  pool.getConnection((err, conn) => {
    if(err){
      conn.release();
      res.send([null, err]);
    }
    conn.query(`DELETE FROM bannerRegistered WHERE bannerId = ? `, [bannerId], (err, result)=>{
      conn.release();
      res.send([true, '배너가 성공적으로 삭제되었습니다.']);
    })
  })
})

/* 2019-07-05
 */
router.post('/banner/push', (req, res, next)=>{
  const marketerId = req._passport.session.user.userid;
  const bannerSrc = req.body.url;
  
  const searchQuery = `
  SELECT bannerId 
  FROM bannerRegistered 
  WHERE marketerId = ?  
  ORDER BY date DESC
  LIMIT 1`;

  const saveQuery = `
  INSERT INTO bannerRegistered 
  (bannerId, marketerId, bannerSrc) 
  VALUES (?, ?, ?)`;

  doQuery(searchQuery, [marketerId])
  .then((row)=>{
    // 이전에 배너를 게시한 적이 있다는 의미.
    let bannerId = '';
    if(row.result[0]){
      const lastBannerId = row.result[0].bannerId;
      var count =  parseInt(lastBannerId.split('_')[1]) + 1;
      if (count < 10){
        bannerId = `${marketerId}_0${count}`;
      }else{
        bannerId = `${marketerId}_${count}`;
      }
    }else{
      bannerId = `${marketerId}_01`;
    }
    doQuery(saveQuery , [bannerId, marketerId, bannerSrc])
    .then(()=>{
      res.send([true, '배너가 등록되었습니다']);
    })
    .catch(()=>{
      res.send([false]);
    })
  })
  .catch(()=>{
    res.send([false]);
  })
})

// 마케터 캐시 충전
router.post('/chargecash', function(req, res, next) {
  const marketerId = req._passport.session.user.userid;
  const chargecash = req.body.chargecash;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
    } else {
      // 충전 데이터 넣기
      const queryState = `
      INSERT 
      INTO marketerCash
      (marketerId, chargeCash, withdrawCash)
      VALUES (?, ?, ?)`;

      const queryArray = [
        marketerId , chargecash ,0
      ];

      conn.query(queryState, queryArray, function(err, result, fields){
          if(err){
            console.log('마케터 캐시충전 정보 입력 오류', err);
          } else {
            
            conn.query(`SELECT 
            marketerId 
            FROM marketerCost
            WHERE marketerId = ?  
            ORDER BY date DESC
            LIMIT 1`, [marketerId], (err, result)=>{
              if(err){
                console.log(err);
                conn.release();
                res.send([null, err]);
              }
              console.log(result)
              if (result.length > 0) {
                // 광고캐시 신청 금액에 맞추어 기존의 marketerDebit에 추가하기
                  const updateQueryState = `
                  INSERT INTO
                  marketerCost (marketerId, marketerDebit)
                  SELECT marketerId, marketerDebit + ?
                  FROM marketerCost
                  WHERE marketerId = ?
                  ORDER BY date DESC
                  LIMIT 1`

                const updateQueryArray = [
                  chargecash, marketerId
                ];

                conn.query(updateQueryState, updateQueryArray, function(err, result, fields){
                  if(err){
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
                  VALUES (?, ?)`

                const updateQueryArray = [
                  marketerId, chargecash
                ];

                conn.query(updateQueryState, updateQueryArray, function(err, result, fields){
                  if(err){
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
            })
          }
      });
    } 
  })
})

// 마케터 캐시 환불
router.post('/return', function(req, res, next) {
  const marketerId = req._passport.session.user.userid;
  const withdrawcash = req.body.withdrawCash;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log(err)
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

      conn.query(queryState, queryArray, function(err, result, fields){
          if(err){
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
        LIMIT 1`
      const updateQueryArray = [
        withdrawcash, marketerId
      ];

      conn.query(updateQueryState, updateQueryArray, function(err, result, fields){
        if(err){
          console.log('마케터 캐시충전 금액 수정삽입 오류', err);
        }
        res.send({
          insertDebit: 'success',
          updateDebit: 'success'
        });
        conn.release();
    });
    }
  })
})

// 마케터 캐시 충전 및 환불 내역
/* 올바른 OUTPUT의 형태
{ columns: [ '날짜', '캐시충전', '캐시환불', '환불상태' ],
  data: [ [ '19년 07월 06일', '0', '0', '진행중' ] ] }
 */
router.get('/cashlist', function(req, res, next) {
  //marketerID 가져오기
  const marketerId = req._passport.session.user.userid;
  const listQuery = `
  SELECT
  DATE_FORMAT(date, '%y년 %m월 %d일') as date, chargeCash, 
  withdrawCash, cashReturnState
  FROM marketerCash
  WHERE marketerId = ?
  ORDER BY date DESC`;

  doQuery(listQuery, [marketerId])
  .then((row)=>{
    const result = cashlist(row.result);
    res.send(result);    
  })
  .catch(()=>{
    res.end();
  })

})

// 마케터 계좌정보 조회
router.get('/accountNumber', function(req, res, next) {
  const marketerId = req._passport.session.user.userid;
  const accountQuery = `
  SELECT marketerAccountNumber
  FROM marketerInfo
  WHERE marketerId = ?`;
  doQuery(accountQuery, [marketerId])
  .then((row)=>{
    const accountNumber = row.result[0].marketerAccountNumber;
    res.send({
      accountNumber
    })
  })
  .catch((error)=>{
    console.log(error);
    res.send({});
  })
})

// bannerMatched의 특정 배너와 계약된 크리에이터 조회
router.get('/contraction/creatorList', function(req, res, next) {
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
    .then((data)=>{
      const { error, result } = data;
      if (error) {
        res.send(error)
      };
      if (result.length > 0) {
        let responseData = [];
        result.map((row) => {
          responseData.push((row.creatorName));
        })
        res.send(responseData);
      }
    })
});


module.exports = router;