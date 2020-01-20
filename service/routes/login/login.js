const express = require('express');
const passport = require('passport');
const checkEmailAuth = require('../../middlewares/checkEmailAuth');
const doQuery = require('../../model/doQuery');
const encrypto = require('../../encryption');

const HOST = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_REACT_HOSTNAME
  : process.env.DEV_REACT_HOSTNAME;
const router = express.Router();

router.post('/', passport.authenticate('local'),
  checkEmailAuth);

router.get('/check', (req, res) => {
  if (req.session.passport && req.session.passport.user.userType === 'marketer') {
    const checkQuery = `
    SELECT temporaryLogin
    FROM marketerInfo
    WHERE marketerId = ?`;

    doQuery(checkQuery, [req.session.passport.user.userid])
      .then((row) => {
        const { temporaryLogin } = row.result[0];
        if (temporaryLogin === 1) {
          res.send({
            error: false,
            state: 1
          });
        } else {
          res.send({
            error: false,
            state: 0,
            userType: 'marketer'
          });
        }
      })
      .catch(() => {
        res.send({
          error: true,
        });
      });
  } else if (req.session.passport && req.session.passport.user.userType === 'creator') {
    res.send({
      // creator 일 경우
      error: false,
      state: 0,
      userType: 'creator'
    });
  } else {
    res.send({
      // creator 일 경우
      error: true,
    });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy(() => {
    console.log('로그아웃 되었습니다.');
  });
  res.end();
});


router.post('/changePw', (req, res, next) => {
  const { password } = req.body;
  const marketerId = req.session.passport.user.userid;
  const [key, salt] = encrypto.make(password);
  const changeQuery = `
  UPDATE marketerInfo 
  SET marketerSalt = ?, marketerPasswd = ?, temporaryLogin = 0 
  WHERE marketerId = ? `;
  doQuery(changeQuery, [salt, key, marketerId])
    .then(() => {
      console.log('비밀번호 변경 성공');
      res.send(true);
    })
    .catch(() => {
      res.send(false);
    });
});

router.get('/twitch', passport.authenticate('twitch'));

router.get('/twitch/callback', passport.authenticate('twitch'),
  (req, res) => {
    console.log('success in server');
    res.redirect(`${HOST}/dashboard/creator/door`);
  });

router.get('/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback', passport.authenticate('google'),
  (req, res) => {
    console.log('success in server');
    // req의 passport data를 확인하여 미존재시는 회원가입으로, 존재시는 dashboard로
    const { registered } = req.session.passport.user;
    if (registered) {
      res.redirect(`${HOST}/dashboard/marketer/main`);
    } else {
      res.redirect(`${HOST}/regist/google`);
    }
    // res.send({userType: userType});
  });


router.get('/naver', passport.authenticate('naver'));

router.get('/naver/callback', passport.authenticate('naver'),
  (req, res) => {
    console.log('success in server');
    // req의 passport data를 확인하여 미존재시는 회원가입으로, 존재시는 dashboard로
    const { registered } = req.session.passport.user;
    if (registered) {
      res.redirect(`${HOST}/dashboard/marketer/main`);
    } else {
      res.redirect(`${HOST}/regist/naver`);
    }
  });


router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao'),
  (req, res) => {
    console.log('success in server');
    // req의 passport data를 확인하여 미존재시는 회원가입으로, 존재시는 dashboard로
    const { registered } = req.session.passport.user;
    if (registered) {
      res.redirect(`${HOST}/dashboard/marketer/main`);
    } else {
      res.redirect(`${HOST}/regist/kakao`);
    }
  });

module.exports = router;
