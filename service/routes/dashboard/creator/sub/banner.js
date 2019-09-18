const express = require('express');
const doQuery = require('../../../../model/doQuery');

const { preprocessingBannerData } = require('../../../../middlewares/preprocessingData/');

const router = express.Router();

// 크리에이터 현재 광고 중 배너
router.get('/current', (req, res) => {
  const { creatorId } = req._passport.session.user;
  // DB연결후 query문을 통한 데이터 삽입
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
  AND bm.contractionId LIKE CONCAT('%', ?, '%')
  ORDER BY ct.date DESC
  LIMIT 1`;

  doQuery(queryState, [creatorId])
    .then((row) => {
      const result = row.result.map((value) => {
        value = Object.values(value);
        return value;
      });
      res.send(result);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// 배너 정보
router.post('/desc', (req, res) => {
  const { contractionId } = req.body;
  const bannerId = contractionId.split('/')[0];
  const descQuery = `
  SELECT *
  FROM bannerRegistered
  WHERE bannerId = ?`;
  doQuery(descQuery, [bannerId])
    .then((row) => {
      res.send(row.result[0]);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// 배너 삭제
router.post('/delete', (req, res) => {
  const { contractionId } = req.body;
  const bannerQuery = `
  DELETE FROM bannerMatched
  WHERE contractionId = ? `;
  doQuery(bannerQuery, [contractionId])
    .then(() => {
      res.send([true, '배너가 성공적으로 삭제되었습니다.']);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send([false, '배너 삭제에 실패하였습니다 잠시후 시도해주세요.']);
    });
});

// 삭제 : closed beta 02!
// 크리에이터 광고 내역 라우터
router.get('/matched', (req, res) => {
  const { creatorId } = req._passport.session.user;
  const bannerQuery = `
  SELECT bm.contractionTime, mi.marketerName, bm.contractionState, br.bannerSrc, bm.contractionId
  FROM bannerMatched as bm
  JOIN bannerRegistered as br 
  ON SUBSTRING_INDEX(bm.contractionId, '/', 1) = br.bannerId
  JOIN marketerInfo as mi
  ON SUBSTRING_INDEX(br.bannerId, '_', 1) = mi.marketerId
  WHERE contractionId LIKE CONCAT('%', ?, '%')
  ORDER BY contractionTime DESC
  `;
  doQuery(bannerQuery, [creatorId])
    .then((row) => {
      if (row.result.length > 0) {
        const result = preprocessingBannerData(row.result);
        res.send(result);
      } else {
        res.end();
      }
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

module.exports = router;
