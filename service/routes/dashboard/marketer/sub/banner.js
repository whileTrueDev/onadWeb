const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

// 광고가능, 광고중 배너 조회 confirmState = 1 or 3
router.get('/', (req, res) => {
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

// 특정 마케터의 모든 배너를 조회
router.get('/all', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const bannerQuery = `
  SELECT bannerSrc, confirmState, bannerId, 
    bannerDenialReason, bannerDescription, 
    companyDescription, landingUrl,
    DATE_FORMAT(date, "%Y년% %m월 %d일") as date,
    DATE_FORMAT(regiDate, "%Y년% %m월 %d일") as regiDate
  FROM bannerRegistered
  WHERE marketerId = ?
  ORDER BY confirmState DESC, regiDate DESC`;
  doQuery(bannerQuery, [marketerId])
    .then((row) => {
      if (row.result.length > 0) {
        res.send(row.result);
      } else {
        res.send([]);
      }
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send([null, errorData]);
    });
});

// 특정 마케터의 승인된 배너를 조회
router.get('/registed', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const bannerQuery = `
  SELECT bannerId, bannerSrc
  FROM bannerRegistered
  WHERE marketerId = ? AND (confirmState = 1 OR confirmState = 3)
  `;
  doQuery(bannerQuery, [marketerId])
    .then((row) => {
      res.send([true, row.result]);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send([null, errorData]);
    });
});

// 배너 삭제
// bannerRegistered
router.post('/delete', (req, res) => {
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

// 배너 등록
// bannerRegistered
router.post('/push', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const {
    bannerSrc, bannerDescription, companyDescription, landingUrl
  } = req.body;

  const searchQuery = `
  SELECT bannerId 
  FROM bannerRegistered 
  WHERE marketerId = ?  
  ORDER BY regiDate DESC
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
        console.log(row.result);
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
      doQuery(saveQuery,
        [bannerId, marketerId, bannerSrc, bannerDescription,
          companyDescription, landingUrl])
        .then(() => {
          res.send([true, '배너가 등록되었습니다']);
        })
        .catch((errorData) => {
          console.log(errorData);
          res.send([false]);
        });
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send([false]);
    });
});

// 전달된 해당 배너와 연결된 캠페인이 있는지 조회
router.get('/connectedcampaign', (req, res) => {
  const { bannerId } = req.query;
  const query = `
  SELECT *
  FROM campaign
  WHERE bannerId = ? AND deletedState = 0`;
  const queryArray = [bannerId];
  doQuery(query, queryArray)
    .then((row) => {
      res.send(row.result);
    })
    .catch((err) => {
      console.log('connectedcampaign', err);
      res.end();
    });
});

module.exports = router;
