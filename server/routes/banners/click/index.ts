import express from 'express';
import doQuery from '../../../model/doQuery';
import responseHelper from '../../../middlewares/responseHelper';

const router = express.Router();

router.route('/')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const dataString = 'DATE_SUB(NOW(), INTERVAL 60 MONTH)';

      const query = `
          SELECT SUM(clickCount) as bannerClick
            FROM landingClick as lc
            WHERE lc.regidate > ?
        `;
      doQuery(query, [dataString])
        .then((row) => {
          if (!row.error && row.result) {
            responseHelper.send(row.result, 'get', res);
          }
        })
        .catch((errorData) => {
          throw new Error(`Error in /banners/click - ${errorData}`);
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
