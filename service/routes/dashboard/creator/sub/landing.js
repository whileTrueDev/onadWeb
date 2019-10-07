// import
const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

router.get('/', (req, res) => {
  const { creatorId } = req._passport.session.user;
  const query = `
  SELECT  creatorTwitchId, creatorDesc, creatorBackgroundImage, creatorTheme, visitCount
  FROM creatorLanding
  WHERE creatorId = ?
  LIMIT 1`;
  const queryArray = [creatorId];

  doQuery(query, queryArray)
    .then((row) => {
      if (!row.error && row.result) {
        res.send(row.result[0]);
      }
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

// creatorLanding update query
router.post('/update', (req, res) => {
  const { description, creatorTheme } = req.body;
  const { creatorId } = req._passport.session.user;

  const query = `
  UPDATE creatorLanding
  SET creatorDesc = ?, creatorTheme = ?
  WHERE creatorId = ?
  `;

  const queryArray = [description, creatorTheme, creatorId];

  doQuery(query, queryArray)
    .then((row) => {
      if (!row.error && row.result) {
        res.send([true]);
      }
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

router.post('/image/upload', (req, res) => {
  console.log('/image/upload requested');
  const { creatorId } = req._passport.session.user;
  const creatorBackgroundImage = req.body.imageUrl;

  const businessRegiQuery = `
  UPDATE creatorLanding
  SET creatorBackgroundImage = ?
  WHERE creatorId = ?`;
  const businessRegiArray = [creatorBackgroundImage, creatorId];

  doQuery(businessRegiQuery, businessRegiArray)
    .then((row) => {
      if (!row.error) {
        res.send([true, '등록되었습니다.']);
      }
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});


router.get('/data', (req, res) => {
  const { creatorId } = req._passport.session.user;
  const selectQuery = `
  SELECT 
  SUM(clickCount) as clickCount, 
  SUM(transferCount) as transferCount,
  B.visitCount, 
  C.exp, 
  truncate(C.exp / 500, 0) + 1 as level,
  C.updateDate AS date 
  FROM landingClick AS A 
  JOIN creatorLanding AS B ON A.creatorId = B.creatorId
  LEFT JOIN creatorRoyaltyLevel AS C ON B.creatorId = C.creatorId 
  WHERE A.creatorId = ?
  `;

  doQuery(selectQuery, [creatorId])
    .then((row) => {
      const data = {
        ...row.result[0],
        date: row.result[0].date.toLocaleString(),
        clickCount: row.result[0].clickCount || 0,
        transferCount: row.result[0].transferCount || 0,
        visitCount: row.result[0].visitCount || 0
      };
      res.send(data);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});


module.exports = router;
