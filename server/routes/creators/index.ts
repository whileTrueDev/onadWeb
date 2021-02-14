import express from 'express';
import doQuery from '../../model/doQuery';
import responseHelper from '../../middlewares/responseHelper';
import analysisRouter from './analysis';

const router = express.Router();

router.use('/analysis', analysisRouter);
router.route('/')
  .get(
    // responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const searchQuery = `
      SELECT cI.creatorId, cI.creatorName, cI.creatorLogo, cI.creatorTwitchId, A.followers, A.content, A.openHour
      FROM creatorInfo as cI

      RIGHT JOIN
      (SELECT creatorId, followers, content, openHour
      FROM creatorDetail
      ) as A
      
      ON cI.creatorId = A.creatorId
      WHERE creatorContractionAgreement = 1 AND creatorTwitchOriginalId IS NOT NULL
      ORDER BY cI.creatorId DESC
      `;
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

router.route('/live')
  .get(
    // 계약중이면서~ 방송중이면서~ 광고송출중인 크리에이터 리스트
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - 10);

      // 현재방송중이면서, 배너를 띄우고있는 스트리머 (시청자 많은 순)
      const query = `SELECT CI.creatorId
      FROM creatorInfo as CI

      LEFT JOIN
      (SELECT streamerName, viewer
      FROM twitchStreamDetail
      WHERE time > ?
      GROUP BY streamerName) as A
      ON CI.creatorName = A.streamerName

      JOIN (
      SELECT creatorId
      FROM campaignTimestamp
      WHERE date > ?
      ) AS B ON CI.creatorId = B.creatorId
      WHERE creatorContractionAgreement  = 1
      ORDER BY viewer DESC`;

      doQuery(query, [date, date])
        .then((row) => {
          const resultList = row.result.map((creator: {
            creatorId: string;
          }) => creator.creatorId);
          responseHelper.send(resultList, 'get', res);
        })
        .catch((errorData) => {
          throw new Error(`Error in /creators/live - ${errorData}`);
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/broadcast')
  .get(
    // 계약중이면서~ 방송중인 크리에이터 리스트
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - 10);

      const query = `SELECT COUNT(creatorId) AS nowBroadcast
      FROM creatorInfo as CI
      RIGHT JOIN
      (SELECT streamerName, viewer
      FROM twitchStreamDetail
      WHERE time > ?
      GROUP BY streamerName) as A
      ON CI.creatorName = A.streamerName
      WHERE creatorContractionAgreement = 1`;

      doQuery(query, [date, date])
        .then((row) => {
          const { result } = row;
          responseHelper.send(result, 'get', res);
        })
        .catch((errorData) => {
          throw new Error(`Error in /creators/live - ${errorData}`);
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/detail')
  .get(
    // 계약중이면서~ 방송중인 크리에이터 리스트
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const query = `SELECT SUM(followers) AS totalFollowers
      FROM creatorDetail`;

      doQuery(query)
        .then((row) => {
          const { result } = row;
          responseHelper.send(result, 'get', res);
        })
        .catch((errorData) => {
          throw new Error(`Error in /creators/live - ${errorData}`);
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
