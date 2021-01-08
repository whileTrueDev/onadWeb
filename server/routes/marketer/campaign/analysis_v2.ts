import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = express.Router();

// 분석 데이터
router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const campaignId = responseHelper.getParam('campaignId', 'GET', req);
      const query = `
      SELECT 
        (SELECT campaignName 
          FROM campaign 
          WHERE campaignId = ?) AS campaignName,
        
        (SELECT SUM(cashFromMarketer)
          FROM campaignLog as cl
          WHERE campaignId= ? AND type="CPM") AS totalCPM,
        
        (SELECT SUM(viewer)
          FROM campaignLog as cl
          WHERE campaignId= ? AND type="CPM" AND viewer IS NOT NULL) AS totalViewCount,
        
        (SELECT SUM(cashFromMarketer)
          FROM campaignLog
          WHERE campaignId= ? AND type="CPC") AS totalCPC,
        
        (SELECT COUNT(*)
          FROM tracking
          WHERE campaignId = ? AND channel = 'adchat' AND os IS NOT NULL) AS adchatClick,
        
        (SELECT COUNT(*)
          FROM tracking 
          WHERE campaignId = ? AND channel = "adpanel"  AND os IS NOT NULL) AS adpanelClick`;

      doQuery(query, [
        campaignId, campaignId, campaignId,
        campaignId, campaignId, campaignId, campaignId
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


// 마케터 캠페인 분석에 사용되는 크리에이터 데이터
// marketer/sub/report =>/clicks
router.route('/heatmap')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const campaignId = responseHelper.getParam('campaignId', 'GET', req);
      const query = `
      SELECT
      DATE_FORMAT(clickedTime, "%Y-%m-%d") AS date,
      count(campaignId) AS count
      FROM tracking
      WHERE campaignId = ?
      GROUP BY DATE_FORMAT(clickedTime, "%Y-%m-%d")
      ORDER BY DATE_FORMAT(clickedTime, "%Y-%m-%d") DESC`;
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
      if (campaignId !== '') {
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


export default router;
