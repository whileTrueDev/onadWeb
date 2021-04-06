import { Router } from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = Router();

const CAMPAIGNLOG_TABLE_NAME = 'campaignLog_copy';

interface CpsAnalysisData {
  totalSalesIncome: number;
  adchatClick: number;
  adpanelClick: number;
  totalSalesAmount: number;
}

/**
 * 캠페인 분석 정보를 가져옵니다. (총 판매액, 총 상품 클릭수, 총 상품 판매수)
 * @param campaignId 캠페인 고유 아이디
 * @returns CpsAnalysisData | null
 */
const getAnalysisData = async (campaignId: string): Promise<null | CpsAnalysisData> => {
  const query = `SELECT
  (
    SELECT SUM(salesIncomeToMarketer)
    FROM ${CAMPAIGNLOG_TABLE_NAME} as cl
    WHERE campaignId = ? AND type = "CPS"
  ) AS totalSalesIncome,

  (
    SELECT COUNT(*) FROM tracking WHERE campaignId = ? AND channel = 'adchat' AND os IS NOT NULL AND costType = "CPS"
  ) AS adchatClick,

  (
    SELECT COUNT(*) FROM tracking WHERE campaignId = ? AND channel = 'adpanel' AND os IS NOT NULL AND costType = "CPS"
  ) AS adpanelClick,

  (
    SELECT COUNT(*) FROM ${CAMPAIGNLOG_TABLE_NAME} WHERE campaignId = ? AND type = "CPS"
  ) AS totalSalesAmount
  `;
  const { result } = await doQuery(query, [campaignId, campaignId, campaignId, campaignId]);
  if (!result || result.length === 0) return null;
  return result[0];
};

router.route('/')
  // CPS 캠페인 판매액
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      const campaignId = responseHelper.getParam('campaignId', 'GET', req);
      const result = await getAnalysisData(campaignId);
      return responseHelper.send(result, 'get', res);
    })
  );

router.route('/chart')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      const campaignId = responseHelper.getParam('campaignId', 'GET', req);
      // 월간, 일별 CPS 클릭
      const clickQuery = `
      SELECT createdAt, COUNT(*) AS amount
      FROM tracking
      WHERE campaignId = ? AND os IS NOT NULL AND costType = "CPS" AND DATE_SUB(createdAt, INTERVAL 1 MONTH)
      GROUP BY DATE_FORMAT(createdAt, "%y년 %m월 %d일")
      ORDER BY createdAt ASC
      `;

      // 월간, 일별 CPS 판매량
      const salesQuery = `
      SELECT date AS createdAt, COUNT(*) AS amount FROM ${CAMPAIGNLOG_TABLE_NAME} 
      WHERE campaignId = ? AND type = "CPS"  
      GROUP BY DATE_FORMAT(date, "%y년 %m월 %d일")   
      ORDER BY date ASC
      `;

      const [{ result }, { result: result2 }] = await Promise.all([
        doQuery(clickQuery, [campaignId]),
        doQuery(salesQuery, [campaignId])
      ]);

      const dataArray: any[] = [];
      result.forEach((value: any) => {
        const obj = { date: value.createdAt, value: value.amount, type: '클릭' };
        dataArray.push(obj);
      });

      result2.forEach((value: any) => {
        const obj = { date: value.createdAt, value: value.amount, type: '판매' };
        dataArray.push(obj);
      });

      const sorted = dataArray.sort((x, y) => x.date - y.date);

      return responseHelper.send(sorted, 'GET', res);
    })
  );

router.route('/creators')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      const query = `
      SELECT
          ci.creatorId AS id,
          ci.creatorId AS creatorId, 
          ci.creatorName AS creatorTwitchName,
          ci.creatorTwitchId AS creatorTwitchId,
          ci.creatorLogo AS creatorLogo, 
          ci.afreecaId,
          ci.afreecaName,
          ci.afreecaLogo,
          COUNT(*) AS total_sales_amount,
          cd.viewer AS viewer,
          cd.followers AS followers, 
          cd.airtime AS airtime, 
          cd.impression AS impression, 
          cd.openHour AS openHour, 
          cd.content AS content,
          cd.ctr,
          cd.contentsGraphData,
          cd.timeGraphData,
          cda.contentsGraphData AS contentsGraphDataAfreeca,
          cda.timeGraphData  AS timeGraphDataAfreeca,
          cda.viewer AS viewerAfreeca,
          cda.ctr AS ctrAfreeca,
          cda.followers AS followersAfreeca, 
          cda.airtime AS airtimeAfreeca, 
          cda.impression AS impressionAfreeca, 
          cda.openHour AS openHourAfreeca, 
          cda.content AS contentAfreeca,
          MAX(cl.date) AS recentDate
        FROM campaignLog_copy as cl
          JOIN creatorInfo as ci ON cl.creatorId = ci.creatorId
          LEFT JOIN creatorDetail AS cd ON cl.creatorId = cd.creatorId
          LEFT JOIN creatorDetailAfreeca AS cda ON cl.creatorId = cda.creatorId
        WHERE campaignId = ? AND ci.arrested != 1  AND (cd.impression != 0 OR cda.impression != 0)
          GROUP BY cl.creatorId
          ORDER BY total_sales_amount DESC  `;
      const queryArray = ['gubgoo_c35'];

      const { result } = await doQuery(query, queryArray);
      return responseHelper.send(result, 'get', res);
    })
  );

export default router;
