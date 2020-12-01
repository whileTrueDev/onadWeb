import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = express.Router();

export interface Link {
  primary: boolean; linkName: string; linkTo: string;
}

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


router.route('/current')
  .get(responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const [offset, page] = responseHelper.getParam(['offset', 'page'], 'get', req);
      const query = `
      SELECT tracking.id, clickedTime, costType, tracking.linkId, campaignName, links, creatorId, payout, channel, os, browser
        FROM tracking
        JOIN linkRegistered AS lr
        ON lr.linkId = tracking.linkId
        WHERE creatorId = ?
        ORDER BY clickedTime DESC
        LIMIT ?, ?
      `;
      const queryArray = [creatorId, Number(page), Number(offset)];

      interface CurrentClickQueryRes {
        id: string; clickedTime: string; costType: string; linkId: string;
        campaignName: string; links: string; creatorId: string;
        payout: number; channel: string;
      }

      const { result } = await doQuery<CurrentClickQueryRes[]>(query, queryArray);
      const response = result.map((click) => {
        const links: { links: Link[] } = JSON.parse(click.links);
        return {
          ...click, links
        };
      });

      responseHelper.send(response, 'get', res);
    }));
/**
 * 클릭 광고로 첫 수익 달성 여부를 반환하는 라우터.
 */
router.route('/start-check').get(
  responseHelper.middleware.checkSessionExists,
  responseHelper.middleware.withErrorCatch((async (req, res, next) => {
    const { creatorId } = responseHelper.getSessionData(req);
    const query = `
    SELECT * FROM campaignLog WHERE creatorId = ? AND type = "CPC" ORDER BY date DESC LIMIT 1`;
    doQuery(query, [creatorId])
      .then((row) => {
        responseHelper.send(row.result, 'get', res);
      })
      .catch((error) => { responseHelper.promiseError(error, next); });
  }))
);

export default router;
