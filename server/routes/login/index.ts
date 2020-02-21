
import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/twitch', passport.authenticate('twitch'));
router.get('/twitch/callback', (req, res, next) => {
  res.send('twitch');
});

export default router;
