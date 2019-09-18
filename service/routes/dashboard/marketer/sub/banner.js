const express = require('express');
const doQuery = require('../../../../model/doQuery');
const CustomDate = require('../../../../middlewares/customDate');

const router = express.Router();

// doQuery 수정
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

// 특정 마케터의 배너를 조회
router.get('/all', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const bannerQuery = `
  SELECT bannerId, bannerSrc, bannerCategory, date, confirmState, bannerDenialReason
  FROM bannerRegistered
  WHERE marketerId = ?
  ORDER BY date DESC`;
  doQuery(bannerQuery, [marketerId])
    .then((row) => {
      res.send([true, row.result]);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send([null, errorData]);
    });
});

// 배너의 상태를 시작으로 바꾸는 쿼리
// bannerMatched
router.post('/start', (req, res) => {
  const { bannerId, creators } = req.body;
  const dateCode = new CustomDate().getCode();
  const selectQuery = `
  SELECT contractionId
  FROM bannerMatched
  JOIN creatorInfo
  ON creatorName = ?
  WHERE contractionId LIKE CONCAT(?, "/", creatorId, "%")
  AND contractionState = 2
  `;

  const updateQuery = `
  UPDATE bannerMatched
  SET contractionState = 0
  WHERE contractionId = ?
  `;

  const insertQuery = `
  INSERT INTO bannerMatched 
  (contractionId)
  SELECT CONCAT(?, "/", creatorId, "/", ?)
  FROM creatorInfo
  WHERE creatorName = ?
  `;

  const insertLandingClickQuery = `
  INSERT INTO landingClick (clickCount, transferCount, contractionId)
  VALUES (?, ?, ?)`;

  Promise.all(creators.map((creator) => {
    doQuery(selectQuery, [creator, bannerId])
      .then((row) => {
        if (row.result.length !== 0) {
        // 이전에 계약한 경우가 존재할 떄
          return Promise.all([
          // contractionId 생성
            doQuery(updateQuery, [0, row.result[0].contractionId]),
            // landingClick 기본값 생성
            doQuery(insertLandingClickQuery, [0, 0, row.result[0].contractionId])
          ]);
        }
        // 이전에 계약한 배너가 존재하지 않은 경우.
        return doQuery(insertQuery, [bannerId, dateCode, creator]);
      })
      .catch((errorData) => {
        console.log(errorData);
      });
  }))
    .then(() => {
      res.send(true);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send(false);
    });
});

// 배너의 상태를 시작으로 바꾸는 쿼리
// bannerRegistered
router.post('/start/statechange', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const { bannerId } = req.body;
  const bannerQuery = `
  UPDATE bannerRegistered
  SET confirmState = ?
  WHERE bannerId = ? AND marketerId = ?
  `;

  doQuery(bannerQuery, [3, bannerId, marketerId])
    .then(() => {
      res.send(true);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send(false);
    });
});

// 배너의 상태를 일시정지로 바꾸는 쿼리
// bannerRegistered
router.post('/stop/statechange', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const { bannerId } = req.body;
  const updateQuery = `
  UPDATE bannerRegistered
  SET confirmState = ?
  WHERE bannerId = ? AND marketerId = ?
  `;
  doQuery(updateQuery, [1, bannerId, marketerId])
    .then(() => {
      res.send(true);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end(false);
    });
});

// 배너의 상태를 일시정지로 바꾸는 쿼리
// bannerMatched
router.post('/stop', (req, res) => {
  const { bannerId, creators } = req.body;
  const selectQuery = ` 
  SELECT creatorId
  FROM creatorInfo
  WHERE creatorName = ?
  `;
  const stopQuery = `
  UPDATE bannerMatched
  SET contractionState = 2
  WHERE contractionId LIKE CONCAT(?, "%")
  AND contractionState = 0
  `;
  console.log(creators);
  Promise.all(creators.map((creator) => {
    doQuery(selectQuery, [creator])
      .then((row) => {
        const contractionId = `${bannerId}/${row.result[0].creatorId}`;
        return doQuery(stopQuery, [contractionId]);
      });
  }))
    .then(() => {
      res.send('success!');
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send(false);
    });
});

// 해당 마케터의 성과 차트 데이터 조회
// contractionValue
router.get('/value', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const valueQuery = `
  SELECT contractionId,
  SUM(contractionTotalValue) as contractionTotalValue,
  DATE_FORMAT(date, '%m-%d') as date
  FROM contractionValue
  WHERE SUBSTRING_INDEX(contractionId, '_' , 1) = ?
  AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  GROUP BY DATE_FORMAT(date, '%y%m%d')
  ORDER BY DATE_FORMAT(date, '%y%m%d')
  `;
  doQuery(valueQuery, [marketerId])
    .then((row) => {
      const dataSet = [];
      const labels = [];
      row.result.map((data) => {
        dataSet.push(Math.ceil(data.contractionTotalValue));
        labels.push(data.date);
      });
      res.send({ dataSet, labels });
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
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
  ORDER BY date DESC
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
        .catch(() => {
          res.send([false]);
        });
    })
    .catch(() => {
      res.send([false]);
    });
});

module.exports = router;
