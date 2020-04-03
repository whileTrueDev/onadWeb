import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = express.Router();

router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);

      const query = `
      SELECT channel, count(*) AS count
        FROM tracking
      WHERE creatorId = ?
      GROUP BY channel`;
      const queryArray = [creatorId];
      interface ClicksResult {
        channel: string; count: number;
      }
      const row = await doQuery<ClicksResult[]>(query, queryArray);

      if (row.result) {
        interface ClicksResData { [key: string]: number }
        const result: ClicksResData = {};
        row.result.forEach((r) => {
          result[r.channel] = Number(r.count);
        });
        responseHelper.send(result, 'get', res);
      }
    })
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
