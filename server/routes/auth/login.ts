
import express from 'express';
import passport from 'passport';
// import checkEmailAuth from '../../middlewares/checkEmailAuth';

const router = express.Router();

// local 로그인
router.get('/', passport.authenticate('local')); // checkEmailAuth 추가

// marketer - google 로그인
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google'),
  (req, res, next) => {
    res.send('success google login');
  });

// marketer - naver
router.get('/naver', passport.authenticate('naver'));
router.get('/naver/callback', passport.authenticate('naver'),
  (req, res, next) => {
    res.send('success naver login');
  });

// marketer - kakao
router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao'),
  (req, res, next) => {
    res.send('success kakao login');
  });

// creator - twitch 로그인
router.get('/twitch', passport.authenticate('twitch'));
router.get('/twitch/callback', passport.authenticate('twitch'),
  (req, res, next) => {
    res.send('success twitch login');
  });

export default router;
