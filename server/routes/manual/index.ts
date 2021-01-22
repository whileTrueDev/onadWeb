import express from 'express';
import createHttpError from 'http-errors';
import doQuery from '../../model/doQuery';
import responseHelper from '../../middlewares/responseHelper';

const router = express.Router();

router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const type = responseHelper.getParam('type', 'get', req);

      if (['creator', 'marketer'].includes(type)) {
        const query = `
        SELECT id, priority, type, title, subTitle, contents, createdAt, updatedAt
        FROM manual WHERE type = ?
        ORDER BY priority, title
        `;
        const { result } = await doQuery(query, [type]);
        responseHelper.send(result, 'get', res);
      } else {
        responseHelper.promiseError(new createHttpError[401]('type parameter is required'), next);
      }
    })
  );

export default router;
