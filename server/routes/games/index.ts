import express from 'express';
import doQuery from '../../model/doQuery';
import responseHelper from '../../middlewares/responseHelper';

const router = express.Router();

router.get('/',
  responseHelper.middleware.checkSessionExists,
  responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const query = 'SELECT categoryId, categoryNameKr, isSub, parentCategoryId FROM AfreecaCategory';

    const { result } = await doQuery(query);

    responseHelper.send(result, 'get', res);
  }));

export default router;
