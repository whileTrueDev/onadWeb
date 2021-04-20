import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';


const router = express.Router();

// 마케터 대시보드의 비용에 대한 차트 데이터 제공
// marketer/sub/campaign =>/chart
// test 완료
router.route('/expenditure')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
      SELECT
        DATE_FORMAT(max(cl.date), "%Y-%m-%d") as date,
        IFNULL(sum(cashFromMarketer), 0) as value,
        type
      FROM campaignLog AS cl
      WHERE SUBSTRING_INDEX(cl.campaignId, '_', 1) = ?
        AND cl.date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
      ORDER BY cl.date DESC
            `;
      doQuery(query, [marketerId])
        .then((row) => {
          responseHelper.send(row.result, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

// 마케터 대시보드의 판매에 대한 차트 데이터 제공
// 마케터의 CPS 캠페인들의 클릭, CPS 판매
router.route('/expenditure/cps')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      const { marketerId } = responseHelper.getSessionData(req);

      // 월간, 일별 CPS 클릭
      const clickQuery = `
      SELECT 
        DATE_FORMAT(max(createdAt), "%Y-%m-%d") as date,
        COUNT(*) AS amount
      FROM tracking
      WHERE marketerId = ? AND os IS NOT NULL AND costType = "CPS" AND DATE_SUB(createdAt, INTERVAL 1 MONTH)
      GROUP BY DATE_FORMAT(createdAt, "%y년 %m월 %d일")
      ORDER BY createdAt ASC
      `;

      // 월간, 일별 CPS 판매량
      const salesQuery = `
      SELECT
        DATE_FORMAT(max(date), "%Y-%m-%d") as date,
        COUNT(*) AS amount
      FROM campaignLog
      WHERE SUBSTRING_INDEX(campaignId, '_', 1) = ? AND type = "CPS"
      GROUP BY DATE_FORMAT(date, "%y년 %m월 %d일")
      ORDER BY date ASC
      `;

      const [{ result }, { result: result2 }] = await Promise.all([
        doQuery(clickQuery, [marketerId]),
        doQuery(salesQuery, [marketerId])
      ]);

      const dataArray: any[] = [];
      result.forEach((value: any) => {
        const obj = { date: value.date, value: value.amount, type: '클릭' };
        dataArray.push(obj);
      });

      result2.forEach((value: any) => {
        const obj = { date: value.date, value: value.amount, type: '판매' };
        dataArray.push(obj);
      });

      const sorted = dataArray.sort((x, y) => x.date - y.date);

      return responseHelper.send(sorted, 'GET', res);
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

// 마케터 대시보드의 크리에이터 수를 체크하는 라우트
// marketer/sub/report =>/counts
// test 완료
router.route('/creator-count')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
            SELECT COUNT( DISTINCT creatorId ) AS counts
            FROM campaignLog AS CL
            INNER JOIN
            (SELECT campaignId FROM campaign WHERE marketerId = ?) AS CP
            ON CL.campaignId = CP.campaignId
            `;
      doQuery(query, [marketerId])
        .then((row) => {
          responseHelper.send({ counts: row.result[0].counts }, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

// 마케터의 캠페인을 송출하는 크리에이터 중에서 현재 방송중임을 보여주기 위해서
// marketer/marketer =>/broadcast/creator
// test 완료
router.route('/creator/list')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const tenMinuteAgoTime = new Date();
      tenMinuteAgoTime.setMinutes(tenMinuteAgoTime.getMinutes() - 10);
      const query = `
          SELECT streamerName, creatorTwitchId, viewer FROM twitchStreamDetail
              JOIN creatorInfo
              ON creatorInfo.creatorName = twitchStreamDetail.streamerName
              JOIN campaignTimestamp
              ON campaignTimestamp.creatorId = creatorInfo.creatorId
              WHERE TIME > ? 
              AND creatorInfo.creatorContractionAgreement = 1
              AND campaignTimestamp.date > ?
              AND substring_index(campaignTimestamp.campaignId, "_", 1) = ?`;
      doQuery(query, [tenMinuteAgoTime, tenMinuteAgoTime, marketerId])
        .then((row) => {
          const result = row.result.map((d: any) => d.streamerName);
          responseHelper.send(result, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
