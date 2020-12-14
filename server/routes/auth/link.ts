
import express from 'express';
import passport from 'passport';

const HOST = process.env.REACT_HOSTNAME;
const router = express.Router();

// ************************************************************
// 온애드 계정 - 트위치 연결
// middlewares/auth/passport/verification 의 creatorTwitchLink 함수를 확인.
router.get('/twitch', passport.authenticate('twitch-link'));
router.route('/twitch/callback')
  .get(
    passport.authenticate('twitch-link'),
    (req, res, next) => {
      res.redirect(`${HOST}/mypage/creator/user`);
    }
  )
  // exception filter 역할의 에러 처리 미들웨어
  .get((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.message) {
      res.redirect(`${HOST}/mypage/creator/user?${err.message}&platform=twitch`);
    } else res.redirect(`${HOST}/mypage/creator/user?error=error&platform=twitch`);
  },);

export default router;
