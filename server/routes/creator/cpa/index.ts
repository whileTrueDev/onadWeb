import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
// types
import {
  AdPickCampaign, AdPickState, AdPickIncome,
  CPAmainData, CPADetail
} from './CpaTypes';

const router = express.Router();

const CAMPAIGNID_PREFIX = 'adpick_';

// 캠페인 별 수익금 정보
router.route('/adpick/incomes')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);

      const query = `
      SELECT
        apOffer, apType, apAppTitle, apImages,
        SUM(cashToCreator) AS campaignIncome,
        COUNT(*) AS conversionCount
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
      ORDER BY campaignLog.date DESC`;
      const queryArray = [creatorId];

      // 크리에이터 cpa 페이지 상태
      const stateQuery = `
      SELECT campaignId, state
      FROM adpageClick
      WHERE creatorId = ?`;

      interface AdPickIncomeResult {
        apOffer: string; apType: string; apAppTitle: string; apImages: string;
        campaignId: string; campaignIncome: number; conversionCount: number;
      }

      const row = await doQuery<AdPickIncomeResult[]>(query, queryArray);
      const stateRow = await doQuery<AdPickState[]>(stateQuery, [creatorId]);
      if (!row.error && !stateRow.error) {
        responseHelper.send(
          row.result.map((c) => ({
            ...c,
            apImages: JSON.parse(c.apImages),
            campaignState: stateRow.result
              .find((x) => x.campaignId.replace(CAMPAIGNID_PREFIX, '') === c.apOffer)?.state,
          })),
          'get',
          res
        );
      }
    })
  );

// 캠페인 정보
router.route('/adpick/campaigns')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);

      // 크리에이터: 수익금의 40%를 가져가므로.
      const query = `
      SELECT
        id, apOffer, apType, apCategory,
        apPackage, apItemid, apAppTitle,
        apHeadline, apVideo, apDailyCap,
        apRemain, apAppPromoText, apKPI,
        apPartner, apImages, apTrackingLink,
        apHook, apEvent, FORMAT(apPayout * (4/10), 0) AS apPayout,
        apOS, apIOSPayout, createdAt, updatedAt
      FROM adPickCampaign
      WHERE createdAt > DATE_SUB(NOW(), INTERVAL 10 minute)
      `;

      // 크리에이터 cpa 페이지 상태
      const stateQuery = `
      SELECT campaignId, state
      FROM adpageClick
      WHERE creatorId = ?`;

      // 크리에이터 cpa 캠페인 별 수익금
      const incomeQuery = `
      SELECT campaignId, FORMAT(SUM(cashToCreator), 0) AS payout
      FROM campaignLog
      WHERE type = "CPA" AND creatorId = ?
      GROUP BY campaignId`;

      const campaignRow = await doQuery<AdPickCampaign[]>(query);
      const stateRow = await doQuery<AdPickState[]>(stateQuery, [creatorId]);
      const incomeRow = await doQuery<AdPickIncome[]>(incomeQuery, [creatorId]);
      if (!campaignRow.error && !stateRow.error && !incomeRow.error) {
        const campaignResult = campaignRow.result.map(
          (c) => ({
            ...c,
            apImages: JSON.parse(c.apImages as string),
            campaignState: stateRow.result
              .find((x) => x.campaignId.replace(CAMPAIGNID_PREFIX, '') === c.apOffer)?.state,
            campaignIncome: incomeRow.result
              .find((i) => i.campaignId.replace(CAMPAIGNID_PREFIX, '') === c.apOffer)?.payout
          })
        );
        responseHelper.send(campaignResult, 'get', res);
      }
    })
  );

router.route('/adpick/campaign')
  // 애드픽 캠페인 최초 등록 (자신의 CPA 페이지에 업로드) 
  .post(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const campaignId: string = responseHelper.getParam('campaignId', 'post', req);

      const query = `
      INSERT INTO adpageClick
      (campaignId, creatorId)
      VALUES (?, ?)`;
      const queryArray = [`${CAMPAIGNID_PREFIX}${campaignId}`, creatorId];

      const row = await doQuery(query, queryArray);
      if (!row.error) {
        responseHelper.send(row.result, 'post', res);
      }
    })
  )
  // 애드픽 캠페인 상태 변경
  .patch(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const [campaignId, targetState]: string[] = responseHelper.getParam(['campaignId', 'targetState'], 'post', req);

      const query = `
      UPDATE adpageClick
        SET state = ?
      WHERE campaignId = ?
      AND creatorId = ?`;
      const queryArray = [targetState, `${CAMPAIGNID_PREFIX}${campaignId}`, creatorId];
      const row = await doQuery(query, queryArray);
      if (!row.error) {
        responseHelper.send(row.result, 'patch', res);
      }
    })
  );

router.route('/adpick/mainIndicator')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);

      const query = `
        SELECT
          (SELECT creatorTwitchId FROM creatorInfo WHERE creatorId = ?) AS creatorTwitchId,
          (SELECT IFNULL(SUM(cashToCreator), 0)
            FROM campaignLog
            WHERE type="CPA" AND creatorId = ?
          ) AS totalCPAIncome,
          (SELECT COUNT(campaignId)
            FROM adpageClick
            WHERE creatorId = ? AND SUBSTRING_INDEX(adpageClick.campaignId, "_", 1)='adpick'
          ) AS totalCPACount
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
        const result = row.result.map(
          (v) => ({ ...v, apImages: JSON.parse(v.apImages as string) })
        );
        responseHelper.send(result, 'get', res);
      }
    })
  );
export default router;
