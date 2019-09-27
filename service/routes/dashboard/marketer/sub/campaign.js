const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

// 캠페인 정보 조회 - 캠페인 리스트 테이블
router.get('/', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const query = `
  SELECT *
  FROM campaign
  WHERE marketerId = ? AND c.deletedState = 0
  `;
  const queryArray = [marketerId];

  doQuery(query, queryArray)
    .then((row) => {
      res.send(row.result);
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

// 캠페인 삭제
router.delete('/', (req, res) => {
  const { campaignId } = req.body.data;
  const query = `
  UPDATE campaign
  SET deletedState = 1
  WHERE campaignId = ?`;
  const queryArray = [campaignId];

  doQuery(query, queryArray)
    .then((row) => {
      if (row.result) {
        res.send([true]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});


// 캠페인 정보 조회 - 캠페인 리스트 테이블
router.get('/list', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  // ['onOff', '캠페인명', '일예산', '등록된 배너']
  const query = `
  SELECT
  campaignId, onOff, campaignName,
  FORMAT(dailyLimit, 0) as dailyLimit,
  priorityType, optionType, bannerSrc,
  DATE_FORMAT(c.regiDate, '%y년 %m월 %d일') as regiDate
  
  FROM campaign as c

  LEFT JOIN bannerRegistered as br
  ON br.bannerId = c.bannerId
  WHERE c.marketerId = ? AND c.deletedState = 0
  `;
  const queryArray = [marketerId];
  doQuery(query, queryArray)
    .then((row) => {
      if (!row.error && row.result.length > 0) {
        res.send({ data: row.result });
      } else {
        res.send(null);
      }
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

router.post('/onoff', (req, res) => {
  const { onoffState, campaignId } = req.body; // boolean값
  const query = `
  UPDATE campaign
  SET onOff = ?
  WHERE campaignId = ?`;

  const queryArray = [onoffState, campaignId];

  doQuery(query, queryArray)
    .then((row) => {
      if (row.result) {
        res.send([true]);
      }
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});


// 해당 마케터의 성과 차트 데이터 조회
// contractionValue
router.get('/chart', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const query = `
  SELECT
    cl.date as date,
    sum(cash) as cash, type
  FROM campaignLog AS cl
  WHERE SUBSTRING_INDEX(cl.campaignId, '_', 1) = ?
    AND  cl.date >= DATE_SUB(NOW(), INTERVAL 14 DAY)
  GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
  ORDER BY cl.date DESC
  `;
  const queryArray = [marketerId];

  doQuery(query, queryArray)
    .then((row) => { res.send(row.result); })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

module.exports = router;
