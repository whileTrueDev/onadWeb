import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = express.Router();


router.route('/')
  // 크리에이터 수익금 정보
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const query = `
      SELECT 
      creatorTotalIncome as creatorTotalIncome,
      creatorReceivable as creatorReceivable,
      creatorAccountNumber, creatorIncome.date, creatorContractionAgreement, realName
      FROM creatorInfo as ci
      JOIN creatorIncome 
      ON ci.creatorId = creatorIncome.creatorId
      WHERE ci.creatorId= ? 
      ORDER BY date desc
      LIMIT 1
      `;

      doQuery(query, [creatorId])
        .then(row => {
          const result = row.result[0];
          result.date = result.date.toLocaleString();
          let deciphedAccountNum;
          if (result.creatorAccountNumber) {
            deciphedAccountNum = encrypto.decipher(result.creatorAccountNumber);
          } else {
            deciphedAccountNum = '';
          }
          result.creatorAccountNumber = deciphedAccountNum;
          responseHelper.send(result, 'get', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next)
        }
        )
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;