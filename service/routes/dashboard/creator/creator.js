// import
const express = require('express');
const doQuery = require('../../../model/doQuery');
const CustomDate = require('../../../middlewares/customDate');

const router = express.Router();

// sub router
const bannerRouter = require('./sub/banner');
const chartRouter = require('./sub/chart');
const landingRouter = require('./sub/landing');
const withdrawalRouter = require('./sub/withdrawal');
const notificationRouter = require('./sub/notification');

router.use('/landing', landingRouter);
router.use('/banner', bannerRouter);
router.use('/chart', chartRouter);
router.use('/withdrawal', withdrawalRouter);
router.use('/notification', notificationRouter);

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
  const query = `SELECT 
  creatorTwitchId 
  FROM creatorInfo
  WHERE creatorId = ?`;
  doQuery(query, [creatorId])
    .then((row) => {
      const { creatorTwitchId } = row.result[0];
      res.send(`http://l.onad.io/${creatorTwitchId}`);
    })
    .catch((err) => {
      console.log('ERROR in /landingUrl', err);
      res.end();
    });
});

// creator contraction Update
router.post('/contraction', (req, res) => {
  const { creatorId } = req._passport.session.user;
  const dateCode = new Date();
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
  SELECT 
  creatorId, creatorName, creatorIp, creatorMail, 
  creatorAccountNumber, creatorContractionAgreement, creatorTwitchId
  FROM creatorInfo 
  WHERE creatorId = ?`;

  const NowIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

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
          result: {
            ...userData,
            NowIp
          }
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
  const { newIp } = req.body;
  const { creatorId } = req._passport.session.user;
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

module.exports = router;
