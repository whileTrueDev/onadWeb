// import
const express = require('express');
const doQuery = require('../../../model/doQuery');
const CustomDate = require('../../../middlewares/customDate');

const router = express.Router();

// sub router
const bannerRouter = require('./sub/banner');
const withdrawalRouter = require('./sub/withdrawal');

router.use('/banner', bannerRouter);
router.use('/withdrawal', withdrawalRouter);

// 크리에이터 수익금 정보조회
router.get('/income', (req, res) => {
  const { creatorId } = req._passport.session.user;
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
    .then((row) => {
      const result = row.result[0];
      result.date = result.date.toLocaleString();
      res.json(result);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// 배너 오버레이 URL 주소 가져오기
router.get('/overlayUrl', (req, res) => {
  const { creatorId } = req._passport.session.user;
  const urlQuery = `
  SELECT advertiseUrl, creatorContractionAgreement
  FROM creatorInfo
  WHERE creatorId = ?
  `;
  doQuery(urlQuery, [creatorId])
    .then((row) => {
      const data = row.result[0];
      data.advertiseUrl = `https://banner.onad.io/banner${row.result[0].advertiseUrl}`;
      res.send(data);
    })
    .catch(() => {
      res.end();
    });
});

router.get('/landingUrl', (req, res) => {
  const { creatorId } = req._passport.session.user;
  if (creatorId) {
    res.send(`http://l.onad.io/${creatorId}`);
  } else {
    res.end();
  }
});

// 수익관리 탭의 크리에이터 별 수익금 차트 데이터
router.get('/chartdata', (req, res) => {
  // creatorId 가져오기
  const { creatorId } = req._passport.session.user;
  const { dateRange } = req.query;
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
    .then((row) => {
      doQuery(rangeQuery, [creatorId, dateRange])
        .then((inrows) => {
          const result = {
            creatorAccountNumber: row.result[0].creatorAccountNumber,
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
          } else {
            res.end();
          }
        })
        .catch((errorData) => {
          console.log(errorData);
          res.end();
        });
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });

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
});

// creator contraction Update
router.post('/contraction', (req, res) => {
  const { creatorId } = req._passport.session.user;
  const dateCode = new CustomDate().getCode();
  const insertQuery = `INSERT INTO bannerMatched (contractionId)
  VALUES (CONCAT("onad6309_01/", ?, "/", ?))
  `;

  const updateQuery = `
  UPDATE creatorInfo
  SET creatorContractionAgreement = ?
  WHERE creatorInfo.creatorId = ?`;

  Promise.all([
    doQuery(insertQuery, [creatorId, dateCode]),
    doQuery(updateQuery, [1, creatorId])
  ])
    .then(() => {
      res.send(true);
    })
    .catch(() => {
      res.end();
    });
});

// 유저 정보
router.get('/profile', (req, res) => {
  const profileQuery = `
  SELECT creatorId, creatorName, creatorIp, creatorMail, creatorAccountNumber, creatorContractionAgreement
  FROM creatorInfo 
  WHERE creatorId = ?`;
  if (req._passport.session === undefined) {
    res.send({
      error: true
    });
  } else {
    const { creatorId } = req._passport.session.user;
    doQuery(profileQuery, [creatorId])
      .then((data) => {
        const userData = data.result[0];
        userData.creatorLogo = req._passport.session.user.creatorLogo;
        res.send({
          error: false,
          result: userData
        });
      })
      .catch(() => {
        res.send({
          error: true
        });
      });
  }
});

// 우리와 계약된 모든 크리에이터 리스트를 가져온다.
router.get('/list', (req, res) => {
  const searchQuery = `
  SELECT creatorId, creatorName, creatorLogo
  FROM creatorInfo
  WHERE creatorContractionAgreement = 1 `;
  doQuery(searchQuery)
    .then((row) => {
      res.send([true, row.result]);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send([null, errorData]);
    });
});


// ip change
router.post('/ipchange', (req, res) => {
  const newIp = req.body.value;
  const { creatorId } = req._passport.session.user;
  console.log(req);
  const ipQuery = 'UPDATE creatorInfo SET creatorIp = ? WHERE creatorId = ?';
  doQuery(ipQuery, [newIp, creatorId])
    .then(() => {
      console.log(`${creatorId}님 IP변경완료`);
      res.send(true);
    })
    .catch(() => {
      res.send(false);
    });
});

// router.post('/welcome', function(req, res ) {
//   const creatorId = req._passport.session.user.creatorId;
//   const dateCode =  new CustomDate().getCode();

//   const insertQuery =
//   `INSERT INTO bannerMatched
//   (contractionId)
//   VALUES CONCAT("onad6309_01", "/", ?, "/", ?)
//   `
//   const updateQuery = `
//   UPDATE creatorInfo
//   SET creatorContractionAgreement = ?
//   WHERE creatorInfo.creatorId = ?`;

//   Promise.all([
//     doQuery(insertQuery, [creatorId, dateCode]),
//     doQuery(updateQuery, [1, creatorId])
//   ])
//   .then(()=>{
//     res.send(true);
//   })
//   .catch(()=>{
//     res.send(false);
//   })
// })

module.exports = router;
