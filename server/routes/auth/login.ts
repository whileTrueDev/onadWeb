
import express from 'express';
import passport from 'passport';
// import checkEmailAuth from '../../middlewares/checkEmailAuth';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery';

const HOST = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_REACT_HOSTNAME
  : process.env.DEV_REACT_HOSTNAME;
const router = express.Router();

// local 로그인
router.get('/', passport.authenticate('local')); // checkEmailAuth 추가

// marketer - google 로그인
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google'),
  (req, res) => {
    const session = responseHelper.getSessionData(req);
    if (session.registered) {
      console.log('success google login');
      res.redirect(`${HOST}/dashboard/marketer/main`);
    } else {
      console.log('success google login - 정보입력');
      res.redirect(`${HOST}/regist/google`);
    }
  });

// marketer - naver
router.get('/naver', passport.authenticate('naver'));
router.get('/naver/callback', passport.authenticate('naver'),
  (req, res) => {
    const session = responseHelper.getSessionData(req);
    if (session.registered) {
      console.log('success naver login');
      res.redirect(`${HOST}/dashboard/marketer/main`);
    } else {
      console.log('success naver login - 정보입력');
      res.redirect(`${HOST}/regist/naver`);
    }
  });

// marketer - kakao
router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao'),
  (req, res) => {
    const session = responseHelper.getSessionData(req);
    if (session.registered) {
      console.log('success kakao login');
      res.redirect(`${HOST}/dashboard/marketer/main`);
    } else {
      console.log('success kakao login - 정보입력');
      res.redirect(`${HOST}/regist/naver`);
    }
  });

// creator - twitch 로그인
router.get('/twitch', passport.authenticate('twitch'));
router.get('/twitch/callback', passport.authenticate('twitch'),
  (req, res) => {
    res.redirect(`${HOST}/`);
  });


router.route('/check')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const session = responseHelper.getSessionData(req);

      if (session.userType === 'marketer') {
        const checkQuery = `
      SELECT temporaryLogin
      FROM marketerInfo
      WHERE marketerId = ?`;

        const row = await doQuery(checkQuery, [session.marketerId]);
        if (row.result) {
          const { temporaryLogin } = row.result[0];
          if (temporaryLogin === 1) {
            responseHelper.send({ error: false, state: 1 }, 'get', res);
          } else {
            responseHelper.send({ error: false, state: 0, userType: 'marketer' }, 'get', res);
          }
        }
        throw new Error('MarketerId 가 marketerInfo에 없습니다.');
      } else if (session.userType === 'creator') {
        responseHelper.send({ error: false, state: 0, userType: 'creator' }, 'get', res);
      } else {
        throw new Error('userType is not in creator | marketer');
      }
    })
  )
  .all(responseHelper.middleware.unusedMethod);
export default router;
