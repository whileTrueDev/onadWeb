import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
import ipToGeo from '../../../middlewares/geoip/ipToGeoData';

const router = express.Router();

router.route(['/', '/v2'])
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = 'SELECT * FROM tracking WHERE marketerId = ?';
      const row = await doQuery(query, [marketerId]);
      const result: any[] = [];
      row.result.forEach((click: any) => {
        if (click.ip) {
          const geo = ipToGeo(click.ip);
          if (geo) { result.push(geo); }
        }
      });
      responseHelper.send(result, 'get', res);
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router.route(['/campaign', '/v2/campaign'])
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const campaignId = responseHelper.getParam('campaignId', 'GET', req);
      const query = `
      SELECT
        id, costType, ip, campaignId, creatorId, clickedTime
      FROM tracking WHERE campaignId = ?`;
      const row = await doQuery(query, [campaignId]);
      const result: any[] = [];
      row.result.map((click: any) => {
        if (click.ip) {
          const geo = ipToGeo(click.ip);
          if (geo) { result.push(geo); }
        }
        return click;
      });
      responseHelper.send(result, 'get', res);
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

// **********************************************
// 크리에이터 별 광고 페이지가 있었던 경우의 Geo 데이터 라우터.
// **********************************************
// 마케터 대시보드의 비용에 대한 차트 데이터 제공
router.route('/v1')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `SELECT *
            FROM landingClickIp
            WHERE SUBSTRING_INDEX(campaignId, "_", 1) = ?`;
      doQuery(query, [marketerId])
        .then((row) => {
          const result: any[] = [];
          row.result.forEach((click: any) => {
            if (click.ipAddress) {
              const geo = ipToGeo(click.ipAddress);
              if (geo) { result.push(geo); }
            }
          });
          responseHelper.send(result, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

// 마케터 대시보드의 비용에 대한 차트 데이터 제공
router.route('/v1/campaign')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const campaignId = responseHelper.getParam('campaignId', 'GET', req);
      const query = `
      SELECT
        id, type, ipAddress, campaignId, creatorId, date
      FROM landingClickIp
      WHERE campaignId = ?`;
      doQuery(query, [campaignId])
        .then((row) => {
          const result: any[] = [];
          row.result.map((click: any) => {
            if (click.ipAddress) {
              const geo = ipToGeo(click.ipAddress);
              if (geo) { result.push(geo); }
            }
            return click;
          });
          responseHelper.send(result, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
