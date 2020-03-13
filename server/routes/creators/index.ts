import express from 'express';
import doQuery from '../../model/doQuery';
import responseHelper from '../../middlewares/responseHelper';

const router = express.Router();

router.route('/')
  .get(
    // responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const searchQuery = `
      SELECT creatorTwitchId, creatorName, creatorLogo
      FROM creatorInfo
      WHERE creatorContractionAgreement = 1 
      ORDER BY date DESC
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
      const query = `SELECT creatorTwitchId
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
          const resultList = row.result.map((creator: { creatorTwitchId: string }) => creator.creatorTwitchId);
          responseHelper.send(resultList, 'get', res);
        })
        .catch((errorData) => {
          throw new Error(`Error in /creators/live - ${errorData}`);
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);
export default router;
