import express from 'express';
import responseHelper from '../../../../middlewares/responseHelper';
import doQuery from '../../../../model/doQuery';

const router = express.Router();

// 캠페인 분석보고서의 데이터를 전달하는 route
// marketer/sub/report =>/
router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const campaignId = responseHelper.getParam('campaignId', 'GET', req);
      const query = `
            SELECT 
            (SELECT campaignName 
            FROM campaign 
            WHERE campaignId = ?) AS campaignName,
            
            (SELECT SUM(cashFromMarketer)
            FROM campaignLog as cl
            WHERE campaignId= ? AND type="CPM") AS totalCPM,
            
            (SELECT SUM(cashFromMarketer)
                / (SELECT unitPrice FROM marketerDebit WHERE marketerId = ?)
            FROM campaignLog as cl
            WHERE campaignId= ? AND type="CPM") AS totalViewCount,
            
            (SELECT count(*) / 6
            FROM campaignLog
            WHERE campaignId = ?) AS totalTime,
            
            (SELECT SUM(cashFromMarketer)
            FROM campaignLog
            WHERE campaignId= ? AND type="CPC") AS totalCPC,
            
            (SELECT SUM(clickCount)
            FROM landingClick 
            WHERE campaignId = ?) AS totalClick,
            
            (SELECT SUM(transferCount)
            FROM landingClick 
            WHERE campaignId = ?) AS totalTransfer,

            (SELECT count(*) FROM landingClickIp
            WHERE date > (SELECT regiDate FROM campaign WHERE campaignId = ?)) AS totalLandingView
            `;

      doQuery(query, [
        campaignId, campaignId, marketerId, campaignId,
        campaignId, campaignId, campaignId, campaignId, campaignId
      ])
        .then((row) => {
          responseHelper.send(row.result[0], 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


// 마케터 대시보드의 비용에 대한 차트 데이터 제공
// marketer/sub/report =>/totalSpendChart
router.route('/expenditure')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const campaignId = responseHelper.getParam('campaignId', 'GET', req);
      const totalQuery = `
            SELECT
                cl.date as date,
                sum(cashFromMarketer) as cash, type
            FROM campaignLog AS cl
            WHERE campaignId = ? AND cl.date > DATE_SUB(cl.date, INTERVAL 30 DAY)
            GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
            ORDER BY cl.date ASC
            `;

      const cpmQuery = `
            SELECT
                cl.date as date,
                sum(cashFromMarketer) as cash, type
            FROM campaignLog AS cl
            WHERE campaignId = ?
                AND type="CPM"
                AND cl.date > DATE_SUB(cl.date, INTERVAL 30 DAY)
            GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
            ORDER BY cl.date ASC
            `;

      const cpcQuery = `
            SELECT
                cl.date as date,
                sum(cashFromMarketer) as cash, type
            FROM campaignLog AS cl
            WHERE campaignId = ?
                AND type="CPC"
                AND cl.date > DATE_SUB(cl.date, INTERVAL 30 DAY)
            GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
            ORDER BY cl.date ASC
            `;

      Promise.all([
        doQuery(totalQuery, campaignId),
        doQuery(cpmQuery, campaignId),
        doQuery(cpcQuery, campaignId),
      ])
        .then((row) => {
          const resData = row.map((value) => value.result);
          responseHelper.send(resData, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


// 마케터 캠페인 분석에 사용되는 크리에이터 데이터
// marketer/sub/report =>/creators
router.route('/creator-data')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const campaignId = responseHelper.getParam('campaignId', 'GET', req);
      let query = '';
      let queryArray = [];
      if (campaignId) {
        query = `
        SELECT
        ci.creatorId AS creatorId, 
        ci.creatorName AS creatorName, 
        ci.creatorTwitchId AS creatorTwitchId,
        ci.creatorLogo AS creatorLogo, 
        sum(cashFromMarketer) AS total_ad_exposure_amount,
        cd.viewer AS viewer,
        cd.followers AS followers, 
        cd.airtime AS airtime, 
        cd.impression AS impression, 
        cd.openHour AS openHour, 
        cd.content AS content
        FROM campaignLog as cl
        JOIN creatorInfo as ci
        ON cl.creatorId = ci.creatorId
        LEFT JOIN creatorDetail AS cd
        ON cl.creatorId = cd.creatorId
        WHERE campaignId = ?
        GROUP BY cl.creatorId
        ORDER BY total_ad_exposure_amount DESC`;

        queryArray = [campaignId];
      } else {
        query = `
        SELECT
        ci.creatorId AS creatorId, 
        ci.creatorName AS creatorName, 
        ci.creatorTwitchId AS creatorTwitchId,
        ci.creatorLogo AS creatorLogo, 
        sum(cashFromMarketer) AS total_ad_exposure_amount,
        cd.viewer AS viewer,
        cd.followers AS followers, 
        cd.airtime AS airtime, 
        cd.impression AS impression, 
        cd.openHour AS openHour, 
        cd.content AS content
        FROM campaignLog as cl
        JOIN creatorInfo as ci
        ON cl.creatorId = ci.creatorId
        LEFT JOIN creatorDetail AS cd
        ON cl.creatorId = cd.creatorId
        WHERE SUBSTRING_INDEX(campaignId, '_', 1) = ?
        GROUP BY cl.creatorId
        ORDER BY total_ad_exposure_amount DESC`;

        queryArray = [marketerId];
      }
      doQuery(query, queryArray)
        .then((row) => {
          responseHelper.send(row.result, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


// 마케터 캠페인 분석에 사용되는 크리에이터 데이터
// marketer/sub/report =>/clicks
router.route('/heatmap')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const campaignId = responseHelper.getParam('campaignId', 'GET', req);
      const query = `
            SELECT
            DATE_FORMAT(date, "%Y-%m-%d") AS date,
            count(*) AS count
            FROM landingClickIp
            WHERE campaignId = ?
            GROUP BY DATE_FORMAT(date, "%Y-%m-%d")
            ORDER BY DATE_FORMAT(date, "%Y-%m-%d") DESC`;
      doQuery(query, [campaignId])
        .then((row) => {
          responseHelper.send(row.result, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


export default router;
