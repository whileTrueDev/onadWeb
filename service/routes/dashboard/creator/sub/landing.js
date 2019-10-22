// import
const express = require('express');
const doQuery = require('../../../../model/doQuery');
const CustomDate = require('../../../../middlewares/customDate');

const router = express.Router();

router.get('/', (req, res) => {
  const { creatorId } = req._passport.session.user;
  const query = `
  SELECT  CL.creatorTwitchId, CL.creatorDesc, CL.creatorBackgroundImage, CL.creatorTheme, CR.visitCount
  FROM creatorLanding as CL
  JOIN creatorRoyaltyLevel as CR
  ON CL.creatorId = CR.creatorId 
  WHERE CL.creatorId = ?
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
  const royaltyQuery = `
  SELECT 
  visitCount, 
  level,
  exp
  FROM creatorRoyaltyLevel
  WHERE creatorId = ?
  `;

  const landingQuery = `
  SELECT 
  SUM(clickCount) as clickCount, 
  SUM(transferCount) as transferCount
  FROM landingClick 
  WHERE creatorId = ?
  `;

  const dateCode = new Date().toLocaleString();

  Promise.all([
    doQuery(royaltyQuery, [creatorId]),
    doQuery(landingQuery, [creatorId])
  ]).then((row) => {
    // exp를 이용하여 레벨을 계산. -> level 컬럼에 대한  레벨은
    const [royaltyData, landingData] = row;
    const { clickCount, transferCount } = landingData.result[0];
    const data = {
      ...royaltyData.result[0],
      date: dateCode,
      clickCount: clickCount || 0,
      transferCount: transferCount || 0,
    };
    res.send(data);
  })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});


module.exports = router;
