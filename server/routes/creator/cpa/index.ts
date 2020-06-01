import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
// types
import { CPAmainData, CPADetail } from './CpaTypes';


const router = express.Router();

router.route('/adpick/mainIndicator')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);

      const query = `
        SELECT
          (SELECT IFNULL(SUM(cashToCreator), 0)
            FROM campaignLog
            WHERE type="CPA" AND creatorId = ?
          ) AS totalCPAIncome,
          (SELECT COUNT(campaignId)
            FROM adpageClick
            WHERE creatorId = ? AND SUBSTRING_INDEX(adpageClick.campaignId, "_", 1)='adpick'
          ) AS totalCPACount,
          (SELECT creatorTwitchId 
            FROM creatorInfo
            WHERE creatorId = ?) AS creatorTwitchId
      `;

      const row = await doQuery<CPAmainData[]>(query, [creatorId, creatorId, creatorId]);
      if (!row.error) {
        const result = row.result[0];
        const newResult = { ...result, creatorId };
        responseHelper.send(newResult, 'get', res);
      }
    })
  );

router.route('/adpick/indicatorDetail')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);

      const query = `
      SELECT
        adPickCampaign.apAppTitle as title,
        adPickCampaign.apImages as apImages,
        SUM(cashToCreator) as campaignIncome,
        DATE_FORMAT(MIN(DATE), "%Y년 %m월 %d일") AS startDate,
        DATE_FORMAT(MAX(DATE), "%Y년 %m월 %d일")  AS endDate
      FROM campaignLog
      INNER JOIN adPickCampaign
        ON adPickCampaign.apOffer = SUBSTRING_INDEX(campaignLog.campaignId, "_", -1)
        AND adPickCampaign.id = (
          SELECT A.id
          FROM adPickCampaign AS A
          WHERE A.apOffer = SUBSTRING_INDEX(campaignLog.campaignId, "_", -1)
          ORDER BY A.id LIMIT 1
        )
      WHERE type = "CPA" AND creatorId = ?
      GROUP BY campaignId
      `;

      const row = await doQuery<CPADetail[]>(query, [creatorId]);
      if (!row.error) {
        const result = row.result.map((v) => ({ ...v, apImages: JSON.parse(v.apImages as string) }));
        responseHelper.send(result, 'get', res);
      }
    })
  );

export default router;
