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

router.post('/desc', (req, res) => {
  const { description } = req.body;
  const { creatorId } = req._passport.session.user;

  const query = `
  UPDATE creatorLanding
  SET creatorDesc = ?
  WHERE creatorId = ?
  `;

  const queryArray = [description, creatorId];

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

module.exports = router;
