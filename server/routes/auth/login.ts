
import express from 'express';
import passport from 'passport';
// import checkEmailAuth from '../../middlewares/checkEmailAuth';

const router = express.Router();
router.get('/', passport.authenticate('local'),
  // checkEmailAuth
);
router.get('/twitch', passport.authenticate('twitch'));
router.get('/twitch/callback', passport.authenticate('twitch'),
  (req, res, next) => {
    res.send('success twitch login');
  });

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google'),
  (req, res, next) => {
    res.send('success google login');
  });
export default router;
