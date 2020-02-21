import express from 'express';
import loginRouter from './auth/login';
import logoutRouter from './auth/logout';

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('req.user', req.user);
  console.log('req.session', req.session);
  res.send('hi!');
});
router.use('/login', loginRouter);
router.use('/logout', logoutRouter);

export default router;
