import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = express.Router();

// 분석 데이터
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
        
        (SELECT COUNT(*)
          FROM tracking
          WHERE campaignId = ? AND channel = 'adchat') AS adchatClick,
        
        (SELECT COUNT(*)
          FROM tracking 
          WHERE campaignId = ? AND channel = "adpanel") AS adpanelClick`;

      doQuery(query, [
        campaignId, campaignId, marketerId, campaignId,
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


export default router;
