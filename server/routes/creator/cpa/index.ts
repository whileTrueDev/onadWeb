import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
// types
import { AdPickData } from './CpaTypes';

const router = express.Router();

router.route('/adpick/campaigns')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      // const { creatorId } = responseHelper.getSessionData(req);

      // 크리에이터: 수익금의 40%를 가져가므로.
      const query = `
      SELECT
        id, apOffer, apType, apCategory,
        apPackage, apItemid, apAppTitle,
        apHeadline, apVideo, apDailyCap,
        apRemain, apAppPromoText, apKPI,
        apPartner, apImages, apTrackingLink,
        apHook, apEvent, FORMAT(apPayout * (4/10), 0) AS apPayout,
        apIOSPayout, createdAt, updatedAt
      FROM adPickCampaign
      WHERE createdAt > DATE_SUB(NOW(), INTERVAL 10 minute)
      `;

      const row = await doQuery<AdPickData[]>(query);
      if (!row.error) {
        const result = row.result.map((r) => ({ ...r, apImages: JSON.parse(r.apImages as string) }));
        responseHelper.send(result, 'get', res);
      }
    })
  );

export default router;
