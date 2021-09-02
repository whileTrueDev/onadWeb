import express from 'express';
import passport from 'passport';
// import checkEmailAuth from '../../middlewares/checkEmailAuth';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery';
import checkEmailAuth from '../../middlewares/checkEmailAuth';

const HOST = process.env.REACT_HOSTNAME;
const router = express.Router();

// local 로그인
router.post('/', passport.authenticate('local'), checkEmailAuth); // checkEmailAuth 추가

// marketer - google 로그인
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
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
router.get('/naver/callback', passport.authenticate('naver'), (req, res) => {
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
router.get('/kakao/callback', passport.authenticate('kakao'), (req, res) => {
  const session = responseHelper.getSessionData(req);
  if (session.registered) {
    console.log('success kakao login');
    res.redirect(`${HOST}/mypage/marketer/main`);
  } else {
    console.log('success kakao login - 정보입력');
    res.redirect(`${HOST}/regist/kakao`);
  }
});

// creator - twitch -> 기존 크리에이터 유저의 새로운 로그인 방식 처리
// 기존 아이디에 로그인용 아이디 비번 생성
router.get('/twitch/pre-creator', passport.authenticate('twitch-pre-creator'));
router
  .route('/twitch/pre-creator/callback')
  .get(passport.authenticate('twitch-pre-creator'), (req, res) => {
    const { creatorId, creatorName, accessToken } = req.user as any;
    console.log(req);
    res.redirect(
      [
        `${HOST}/regist/pre-user`,
        `?creatorId=${creatorId}`,
        `&creatorName=${creatorName}`,
        `&accessToken=${accessToken}`,
      ].join(''),
    );
  })
  // exception filter 역할의 에러 처리 미들웨어
  .get((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(err);
    if (err.message) {
      res.redirect(`${HOST}/regist/pre-user?${err.message}&platform=twitch`);
    } else res.redirect(`${HOST}/regist/pre-user?error=error&platform=twitch`);
  });

router
  .route('/check')
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
            .then(row => {
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
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
