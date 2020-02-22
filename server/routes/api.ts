import express from 'express';
import loginRouter from './auth/login';
import logoutRouter from './auth/logout';
import requestMiddleware from '../middlewares/handleRequest';

const router = express.Router();

router.get('/',
  requestMiddleware.checkSession,
  (req, res, next) => {
    res.send('success');
    next();
  });

router.use('/login', loginRouter);
router.use('/logout', logoutRouter);

export default router;
