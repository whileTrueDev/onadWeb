
import express from 'express';
import passport from 'passport';

const HOST = process.env.REACT_HOSTNAME;
const router = express.Router();

// ************************************************************
// 온애드 계정 - 트위치 연결
// middlewares/auth/passport/verification 의 creatorTwitchLink 함수를 확인.
router.get('/twitch', passport.authenticate('twitch-link'));
router.get('/twitch/callback', passport.authenticate('twitch-link'));

export default router;
