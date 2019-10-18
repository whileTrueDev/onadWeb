const express = require('express');
const doQuery = require('../../../model/doQuery');
const bannerRoute = require('./sub/banner');
const cashRoute = require('./sub/cash');
const campaignRoute = require('./sub/campaign');
const profileRoute = require('./sub/profile');
const categoryRoute = require('./sub/category');
const { creatorList } = require('../../../middlewares/preprocessingData');
const notificationRouter = require('./sub/notification');

const router = express.Router();

/**
 * **********************************
 *  Marketer Routes
 * **********************************
 */
router.use('/cash', cashRoute);
router.use('/banner', bannerRoute);
router.use('/profile', profileRoute);
router.use('/campaign', campaignRoute);
router.use('/category', categoryRoute);
router.use('/notification', notificationRouter);


// 캠페인 온오프 조회
router.get('/onoff', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const contractionQuery = `
  SELECT marketerContraction
  FROM marketerInfo
  WHERE marketerId = ?
  `;

  doQuery(contractionQuery, [marketerId])
    .then((row) => {
      const data = row.result[0].marketerContraction === 1;
      res.send({ onOff: data });
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send(false);
    });
});

// 캠페인 On & Off 기능
// 잔액이 0원일 때는 불가능 하도록 정의.
router.post('/onoff', (req, res) => {
  const contractionState = req.body.contraction === false ? 0 : 1;
  const marketerId = req._passport.session.user.userid;
  const costQuery = `
  SELECT cashAmount
  FROM marketerDebit
  WHERE marketerId = ?
  LIMIT 1
  `;

  const infoQuery = `
  UPDATE marketerInfo
  SET marketerContraction = ?
  WHERE marketerId = ?
  `;
  doQuery(costQuery, [marketerId])
    .then((row) => {
      const debit = row.result[0].cashAmount;
      if (debit === 0) {
        res.send([false, '잔액이 부족합니다']);
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
      const data = creatorList(row.result);
      res.send(data);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// bannerMatched의 특정 배너와 계약된 크리에이터 조회
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
        result.forEach((row) => {
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
