// import
const express = require('express');
const doQuery = require('../../model/doQuery');
const creatorRouter = require('./creator/creator');
const marketerRouter = require('./marketer/marketer');
const passport = require('../../passportStrategy');

const router = express.Router();
router.use('/creator', creatorRouter);
router.use('/marketer', marketerRouter);

/** 세션의 userType 함수 및 라우터 */
router.get('/checkUserType', (req, res, next) => {
  if (req._passport.session !== undefined) {
    // 세션이 있는 경우
    const userInfo = req._passport.session.user;
    res.send(userInfo);
  } else {
    // 세션이 없는 경우
    // console.log('from ' + req.headers.referer, new Date(), '- no session');
    res.send('no session');
  }
});

router.get('/check', passport.authenticate('local'));

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
