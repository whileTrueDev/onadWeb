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
      interface ClicksResult { channel: string; count: number }
      const row = await doQuery<ClicksResult[]>(query, queryArray);

      if (row.result.length > 0) {
        interface ClicksResData { [key: string]: number }
        const result: ClicksResData = {};
        row.result.forEach((r) => {
          result[r.channel] = r.count ? Number(r.count) : 0;
        });
        responseHelper.send(result, 'get', res);
      } else {
        const result = { adchat: 0, adpanel: 0 };
        responseHelper.send(result, 'get', res);
      }
    })
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
