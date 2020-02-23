import express from 'express';
import loginRouter from './auth/login';
import logoutRouter from './auth/logout';
import responseHelper from '../middlewares/responseHelper';
import doQuery from '../model/doQuery';

const router = express.Router();

router.route('/')
  .get(
    responseHelper.middleware.checkSession, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const marketerId = responseHelper.getParam(['marketerId', 'marketerName'], req, 'get');
      console.log('marketerId', marketerId);
      // const row = await doQuery('some query', ['some value']);
      res.send(marketerId);
    }),
    // Middleware to Send the Response with headers, json formmattings, ...
  )
  .post(responseHelper.middleware.unusedMethod)
  .put(responseHelper.middleware.unusedMethod)
  .patch(responseHelper.middleware.unusedMethod)
  .delete(responseHelper.middleware.unusedMethod);

router.use('/login', loginRouter);
router.use('/logout', logoutRouter);

export default router;
