
import Axios from 'axios';
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

// http://note.afreecatv.com/app/index.php?page=recv_list&nPageNo=1&nListPerPage=50&nNoteCategory=3

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

export default router;
