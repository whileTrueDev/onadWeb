const express = require('express');
const doQuery = require('../../../model/doQuery');
const bannerRoute = require('./sub/banner');
const cashRoute = require('./sub/cash');
const campaignRoute = require('./sub/campaign');
const profileRoute = require('./sub/profile');
const categoryRoute = require('./sub/category');
const creatordetailRoute = require('./sub/creatordetail');

const { creatorList } = require('../../../middlewares/preprocessingData');
const marketerActionLogging = require('../../../middlewares/marketerActionLog');
const notificationRouter = require('./sub/notification');
const reportRouter = require('./sub/report');
const geoRouter = require('./sub/geo');
const inventoryRoute = require('./sub/inventory');

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
router.use('/report', reportRouter);
router.use('/geo', geoRouter);
router.use('/creatordetail', creatordetailRoute);
router.use('/inventory', inventoryRoute);


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
      const onOffState = row.result[0].marketerContraction === 1;
      res.send({ onOffState });
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send(false);
    });
});

// 잔액이 0원일 때는 불가능 하도록 정의.
router.post('/onoff', (req, res) => {
  const contractionState = req.body.onOffState === false ? 0 : 1;
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
        // 마케터 활동내역 테이블 적재: 마케터 onoff를 위한 상태값
        const MARKETER_ACTION_LOG_TYPE = 7;
        Promise.all([
          doQuery(infoQuery, [contractionState, marketerId]),
          // 마케터 활동내역 테이블 적재
          marketerActionLogging([marketerId, MARKETER_ACTION_LOG_TYPE,
            JSON.stringify({
              onoffState: contractionState // on: 1, off : 0
            })])
        ])
          .then(() => {
            res.send([true, { onOff: contractionState }]);
          })
          .catch((errorData) => {
            console.log(errorData);
            res.send([false]);
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
router.get('/contraction/creatorList', (req, res) => {
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

// 활동 내역 보기 데이터 조회
router.get('/actionlog', (req, res) => {
  const marketerId = req._passport.session.user.userid;

  // 0 - 이벤트 캐시충전 (온애드에서 제공되는)
  // 1 - 자가 캐시충전  v-191226 X : 무통장입급 캐시충전 기능 x이기 떄문.
  // 2 - 배너 업로드(생성) v-191226 ㅇ
  // 3 - 배너 승인 v-191226 ㅇ
  // 4 - 배너 거절 v-191226 ㅇ
  // 5 - 캠페인 생성 v-191226 ㅇ
  // 6 - 캠페인 on / off v-191226 ㅇ
  // 7 - 마케터 광고 on / off v-191226 ㅇ
  // 8 - 세금계산서 발행 / 미발행
  // 9 - 환불요청  v-191226
  // 10 - 환불요청결과

  const query = `
  SELECT *
  FROM marketerActionLog
  WHERE marketerId = ?
  ORDER BY date DESC
  LIMIT 100
  `;
  const queryArray = [marketerId];

  doQuery(query, queryArray).then((row) => {
    if (!row.error && row.result) {
      res.send(row.result);
    } else {
      res.end();
    }
  })
    .catch((err) => {
      console.log('/marketer/actions err - ', err);
      res.end();
    });
});

// 대시보드 - 마케터의 보유 캐시량, 총 소진 비용
router.get('/normal', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const query = `SELECT cashAmount, spendAll FROM
  (
    SELECT cashAmount
    FROM marketerDebit
    WHERE marketerId = ?) AS cashAmount,
  (
    SELECT sum(cashFromMarketer) AS spendAll
    FROM campaignLog
    WHERE SUBSTRING_INDEX(campaignId, "_" , 1) = ?) AS spendAll
  `;

  const queryArray = [marketerId, marketerId];
  doQuery(query, queryArray).then((row) => {
    if (row.result && !row.error) {
      res.send(row.result[0]);
    }
  }).catch((err) => {
    console.log('err in /report/normal', err);
  });
});

// 현재 특정 캠페인을 송출중인 크리에이터 목록
router.get('/broadcast/creator', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const tenMinuteAgoTime = new Date();
  tenMinuteAgoTime.setMinutes(tenMinuteAgoTime.getMinutes() - 10);
  const query = `
  SELECT streamerName, creatorTwitchId, viewer FROM twitchStreamDetail
    JOIN creatorInfo
    ON creatorInfo.creatorName = twitchStreamDetail.streamerName
    JOIN campaignTimestamp
    ON campaignTimestamp.creatorId = creatorInfo.creatorId
    WHERE TIME > ? 
    AND creatorInfo.creatorContractionAgreement = 1
    AND campaignTimestamp.date > ?
    AND substring_index(campaignTimestamp.campaignId, "_", 1) = ?`;
  const queryArray = [tenMinuteAgoTime, tenMinuteAgoTime, marketerId];
  doQuery(query, queryArray).then((row) => {
    if (!row.error && row.result) {
      const result = row.result.map(d => d.streamerName);
      res.send(result);
    }
  }).catch((err) => {
    console.log('err in /report/broadcast/creator', err);
  });
});


module.exports = router;
