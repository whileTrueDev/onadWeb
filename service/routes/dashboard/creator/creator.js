// import
const express = require('express');
const doQuery = require('../../../model/doQuery');
const encrypto = require('../../../encryption');
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
  creatorTotalIncome as creatorTotalIncome,
  creatorReceivable as creatorReceivable,
  creatorAccountNumber, creatorIncome.date, creatorContractionAgreement, realName
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
      let deciphedAccountNum;
      if (result.creatorAccountNumber) {
        deciphedAccountNum = encrypto.decipher(result.creatorAccountNumber);
      } else {
        deciphedAccountNum = '';
      }
      result.creatorAccountNumber = deciphedAccountNum;
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
  const { creatorId, creatorName } = req._passport.session.user;
  const campaignList = JSON.stringify({ campaignList: [] });
  //   const dateCode = new Date();
  // 기본배너 설정을 위한 쿼리
  // const insertQuery = `INSERT INTO bannerMatched (contractionId)
  // VALUES (CONCAT("onad6309_01/", ?, "/", ?))
  // `;
  const campaignQuery = `
  INSERT INTO creatorCampaign
  (creatorId, campaignList, banList)
  VALUES (?, ?, ?)
  `;

  // landing 기본값 쿼리 추가
  const landingQuery = `
    INSERT INTO creatorLanding
    (creatorId, creatorTwitchId)
    VALUES (?, ?)`;

  const updateQuery = `
  UPDATE creatorInfo
  SET creatorContractionAgreement = ?
  WHERE creatorInfo.creatorId = ?`;

  Promise.all([
    // doQuery(insertQuery, [creatorId, dateCode]),
    doQuery(campaignQuery, [creatorId, campaignList, campaignList]),
    doQuery(landingQuery, [creatorId, creatorName]),
    doQuery(updateQuery, [1, creatorId])
  ])
    .then(() => {
      res.send([true]);
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
  creatorAccountNumber, creatorContractionAgreement, creatorTwitchId, realName
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
        // 받은 데이터에 대한 복호화 실시.
        const rawAccount = data.result[0].creatorAccountNumber || '';
        const deciphedAccountNum = encrypto.decipher(rawAccount);
        userData.creatorLogo = req._passport.session.user.creatorLogo;
        userData.creatorAccountNumber = deciphedAccountNum;
        // userData.creatorAccountNumber = rawAccount;
        res.send({
          error: false,
          result: {
            ...userData,
            NowIp,
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
