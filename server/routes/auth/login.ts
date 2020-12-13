
import express from 'express';
import passport from 'passport';
// import checkEmailAuth from '../../middlewares/checkEmailAuth';
import Axios from 'axios';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery';
import checkEmailAuth from '../../middlewares/checkEmailAuth';

const HOST = process.env.REACT_HOSTNAME;
const router = express.Router();

// local 로그인
router.post('/', passport.authenticate('local'), checkEmailAuth); // checkEmailAuth 추가

// marketer - google 로그인
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google'),
  (req, res) => {
    const session = responseHelper.getSessionData(req);
    if (session.registered) {
      console.log('success google login');
      res.redirect(`${HOST}/mypage/marketer/main`);
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
      res.redirect(`${HOST}/mypage/marketer/main`);
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
      res.redirect(`${HOST}/mypage/marketer/main`);
    } else {
      console.log('success kakao login - 정보입력');
      res.redirect(`${HOST}/regist/kakao`);
    }
  });

// creator - twitch -> 새로운 로그인 방식 처리
router.get('/twitch/pre-creator', passport.authenticate('twitch-pre-creator'));
router.get('/twitch/callback', passport.authenticate('twitch-pre-creator'),
  (req, res) => {
    const { creatorId, creatorName, accessToken } = req.user as any;
    res.redirect([
      `${HOST}/creator/signup/pre-user`,
      `?creatorId=${creatorId}`,
      `&creatorName=${creatorName}`,
      `&accessToken=${accessToken}`
    ].join(''));
  });

// creator - twitch 로그인
router.get('/twitch', passport.authenticate('twitch'));
// router.get('/twitch/callback', passport.authenticate('twitch'),
//   (req, res) => {
//     console.log(req.user);
//     res.redirect(`${HOST}/mypage/creator/main`);
//   });

// creator - afreeca 로그인
router.get('/afreeca', (req, res) => {
  Axios.get('https://openapi.afreecatv.com/auth/code',
    {
      params: { client_id: process.env.AFREECA_KEY },
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      }
    })
    .then((apiRes) => {
      res.redirect(apiRes.request.res.responseUrl);
    })
    .catch((err) => {
      console.log(err.response.data);
      res.sendStatus(err.response.status);
    });
});

// 
router.get('/afreeca/callback', (req, res) => {
  const afreecaCode = req.query.code;
  Axios.post('https://openapi.afreecatv.com/auth/token',
    {
      grant_type: 'authorization_code',
      client_id: process.env.AFREECA_KEY,
      client_secret: process.env.AFREECA_SECRET_KEY,
      code: afreecaCode,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      }
    })
    .then((tokenRes) => {
      console.log(tokenRes.data);
      res.redirect(`${HOST}/creator`);
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log(err);
      }
    });
});

router.route('/check')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      if (req.session!.passport) {
        const session = responseHelper.getSessionData(req);

        if (session.userType === 'marketer') {
          const checkQuery = `
          SELECT temporaryLogin
          FROM marketerInfo
          WHERE marketerId = ?`;

          doQuery(checkQuery, [session.marketerId])
            .then((row) => {
              const { temporaryLogin } = row.result[0];
              if (temporaryLogin === 1) {
                responseHelper.send({ error: false, state: 1 }, 'get', res);
              } else {
                responseHelper.send({ error: false, state: 0, userType: 'marketer' }, 'get', res);
              }
            })
            .catch(() => {
              throw new Error('MarketerId 가 marketerInfo에 없습니다.');
            });
        } else if (session.userType === 'creator') {
          responseHelper.send({ error: false, state: 0, userType: 'creator' }, 'get', res);
        }
      } else {
        responseHelper.send({ error: true }, 'get', res);
      }
      // 원래는 에러 핸들링이 필요하나 로그가 너무 찍혀서 주석처리
      //   else {
      //   throw new Error('userType is not in creator | marketer');
      // }
    })
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
