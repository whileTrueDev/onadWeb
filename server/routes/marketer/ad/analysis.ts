import express from 'express';
import responseHelper from '../../../../middlewares/responseHelper';
import doQuery from '../../../../model/doQuery';


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
            sum(cashFromMarketer) as cash, type
            FROM campaignLog AS cl
            WHERE SUBSTRING_INDEX(cl.campaignId, '_', 1) = ?
            AND  cl.date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
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

// 마케터 대시보드의 크리에이터 수를 체크하는 라우트
// marketer/sub/report =>/counts
// test 완료
router.route('/creator-count')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
            select count( DISTINCT creatorId ) as counts
            from 
            campaignLog as CL
            inner join
            (select  campaignId
            from campaign
            where marketerId= ?
            ) as CP
            on CL.campaignId = CP.campaignId
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
