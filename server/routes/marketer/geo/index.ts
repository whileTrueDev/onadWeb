import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
import ipToGeoData from '../../../middlewares/geoip/ipToGeoData';

const router = express.Router();

// 마케터 대시보드의 비용에 대한 차트 데이터 제공
router.route('/')
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
              const geo = ipToGeoData(click.ipAddress);
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
router.route('/campaign')
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
              const geo = ipToGeoData(click.ipAddress);
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
