// import
const express = require('express');
const doQuery = require('../../model/doQuery');
const creatorRouter = require('./creator/creator');
const marketerRouter = require('./marketer/marketer');

const router = express.Router();
router.use((req, res, next) => {
  if (req && req._passport && req._passport.session
    && req._passport.session.user) {
    next();
  } else {
    res.send('session not exists');
  }
});

router.use('/creator', creatorRouter);
router.use('/marketer', marketerRouter);

router.get('/notice', (req, res) => {
  const query = `
  SELECT code, topic, title, contents, regiDate
  FROM publicNotice
  ORDER BY code DESC
  `;

  doQuery(query)
    .then((rows) => {
      if (!rows.error) {
        res.send(rows.result);
      }
    })
    .catch((err) => {
      console.log('/notice ERROR - ', err);
      res.end();
    });
});

module.exports = router;
