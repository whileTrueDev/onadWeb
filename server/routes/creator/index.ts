import express from 'express';
import responseHelper from '../../middlewares/responseHelper';
import dataProcessing from '../../lib/dataProcessing';
import doQuery from '../../model/doQuery';
import encrypto from '../../middlewares/encryption';

const router = express.Router();

router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const session = responseHelper.getSessionData(req);
      const { creatorId } = responseHelper.getSessionData(req);
      const NowIp: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress;


      const query = `
      SELECT creatorId, creatorName, creatorIp, creatorMail, 
      creatorAccountNumber, creatorContractionAgreement, creatorTwitchId, realName
      FROM creatorInfo
      WHERE creatorId = ?
      `;

      doQuery(query, [creatorId])
        .then(row => {
          const userData = row.result[0];
          const rawAccount: string = row.result[0].creatorAccountNumber || '';
          const deciphedAccountNum: string = encrypto.decipher(rawAccount);
          userData.creatorLogo = session.creatorLogo;
          userData.creatorAccountNumber = deciphedAccountNum;
          const result: object = {
            ...userData,
            NowIp
          }
          responseHelper.send(result, 'get', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next)
        }
        )
    }),

  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
