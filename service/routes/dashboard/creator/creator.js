// import
const express = require('express');
const doQuery = require('../../../model/doQuery');
const CustomDate = require('../../../middlewares/customDate');

const router = express.Router();

// sub router
const bannerRouter = require('./sub/banner');
const landingRouter = require('./sub/landing');
const withdrawalRouter = require('./sub/withdrawal');

router.use('/banner', bannerRouter);
router.use('/landing', landingRouter);
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
      res.send(row.result[0]);
    })
    .catch(() => {
      res.end();
    });
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
              return null;
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
  SELECT creatorId, creatorName, creatorIp, creatorMail, creatorAccountNumber, creatorContractionAgreement, creatorTwitchId
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
