import express from 'express';
import doQuery from '../../model/doQuery';
import responseHelper from '../../middlewares/responseHelper';

const router = express.Router();

router.route('/detail')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const searchQuery = `
      SELECT *
      FROM creatorDetail
      left join 
      (
      select creatorId, creatorLogo, creatorName
      from creatorInfo
      )as B
      on creatorDetail.creatorId = B.creatorId
      WHERE rip > 0.5
      order by viewer desc`;
      doQuery(searchQuery, [])
        .then((row) => {
          responseHelper.send(row.result, 'get', res);
        })
        .catch((errorData) => {
          throw new Error(`Error in /creators - ${errorData}`);
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/contents')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const creatorId = responseHelper.getParam('creatorId', 'GET', req);
      const query = `
      SELECT
        creatorName, creatorTwitchId, creatorLogo, contentsGraphData
      FROM creatorDetail AS cc
      JOIN creatorInfo AS ci
      ON ci.creatorId = cc.creatorId
      WHERE cc.creatorId = ?`;
      doQuery(query, [creatorId])
        .then((row) => {
          if (row.result.length > 0) {
            const result = row.result.map((r: { creatorName: string; creatorTwitchId: string; creatorLogo: string; contentsGraphData: string }) => ({
              ...r,
              contentsGraphData: JSON.parse(r.contentsGraphData)
            }));
            responseHelper.send(result[0], 'get', res);
          } else {
            responseHelper.send(null, 'get', res);
          }
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


router.route('/hours')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const creatorId = responseHelper.getParam('creatorId', 'GET', req);
      const query = `
      SELECT creatorName, timeGraphData
      FROM creatorDetail AS cc
      JOIN creatorInfo AS ci
      ON ci.creatorId = cc.creatorId
      WHERE cc.creatorId = ?`;
      doQuery(query, [creatorId])
        .then((row) => {
          if (row.result.length > 0) {
            const result = row.result.map((r: { creatorName: string; timeGraphData: string }) => ({
              ...r,
              timeGraphData: JSON.parse(r.timeGraphData)
            }));
            responseHelper.send(result[0], 'get', res);
          } else {
            responseHelper.send(null, 'get', res);
          }
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


router.route('/games')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const query = `
      SELECT
        count(content) AS count,
        content, gameId, gameName, gameNameKr, boxArt
      FROM creatorDetail
      JOIN twitchGame ON content = gameName
      WHERE content IS NOT NULL
      GROUP BY content ORDER BY count(content) DESC
      `;
      doQuery(query, [])
        .then((row) => {
          responseHelper.send(row.result, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


// marketer/sub/report =>/detail
router.route('/detail-data')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const creatorId = responseHelper.getParam('creatorId', 'GET', req);
      const query = `
      SELECT *
      FROM creatorDetail
      WHERE creatorId = ? `;
      doQuery(query, [creatorId])
        .then((row) => {
          let detailData = {};
          // string to JSON data
          if (row.result.length > 0) {
            const { timeGraphData, contentsGraphData } = row.result[0];

            detailData = {
              ...row.result[0],
              // timeGraphData: JSON.parse(timeGraphData),
              // contentsGraphData: JSON.parse(contentsGraphData),
            };
          }
          responseHelper.send(detailData, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
