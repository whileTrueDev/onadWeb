// import
const express = require('express');
const router = express.Router();
const creatorRouter = require('./creator');
const marketerRouter = require('./marketer');
const passport = require('../passportStrategy');

router.use('/creator', creatorRouter);
router.use('/marketer', marketerRouter);

/** 세션의 userType 함수 및 라우터 */
router.get('/checkUserType', function(req, res, next) {
  if (req._passport.session !== undefined) {
    // 세션이 있는 경우
    const userInfo = req._passport.session.user;
    // console.log('from ' + req.headers.referer, userInfo.creatorDisplayName, new Date(), '- valid');
    res.send(userInfo);
  } else {
    // 세션이 없는 경우
    //console.log('from ' + req.headers.referer, new Date(), '- no session');
    res.send('no session');
  }
});

router.get('/check', passport.authenticate('local'));

module.exports = router;