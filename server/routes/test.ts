import express from 'express';
import responseHelper from '../middlewares/responseHelper';
import dataProcessing from '../lib/dataProcessing';
import doQuery from '../model/doQuery';

const router = express.Router();

router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const session = responseHelper.getSessionData(req);
      if (session.creatorId) {
        const row = await doQuery('SELECT * from creatorInfo where creatorId = ?', [session.creatorId]);
        const someResult = await dataProcessing.someDataProcessingFunction(row); // 에러핸들링 포함 함수
        responseHelper.send({
          creatorId: row.result[0].creatorId,
          message: '성공'
        }, 'get', res);
      } else {
        throw new Error('not creator session');
      }
    }),
  )
  .post(responseHelper.middleware.unusedMethod)
  .put(responseHelper.middleware.unusedMethod)
  .patch(responseHelper.middleware.unusedMethod)
  .delete((req, res, next) => {
    console.log('test/delete success');
    res.json({ hi: 'hi' });
  });

export default router;
