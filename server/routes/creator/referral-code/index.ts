import express from 'express';
import doQuery from '../../../model/doQuery';
import responseHelper from '../../../middlewares/responseHelper';

const router = express.Router();

router.get('/',
  responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const referralCode = responseHelper.getParam('referralCode', 'get', req);
    const query = `
    SELECT a.creatorId, referralCode, creatorName, afreecaName, loginId, calculateState
    FROM creatorReferralCode as a
    JOIN creatorInfo AS c USING(creatorId)
    LEFT JOIN creatorReferralCodeLogs as l USING(referralCode)
    WHERE referralCode = ?
    LIMIT 1 
    `;

    const { result } = await doQuery(query, [referralCode]);

    responseHelper.send(result, 'get', res);
  }));

router.get('/my',
  responseHelper.middleware.checkSessionExists,
  responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const { creatorId } = responseHelper.getSessionData(req);
    const query = `
    SELECT referralCode, calculateState, B.createdAt, B.calculatedAt, C.creatorName, C.afreecaName, C.loginId, C.creatorContractionAgreement
    FROM creatorReferralCode AS A
    LEFT JOIN creatorReferralCodeLogs AS B USING(referralCode)
    JOIN creatorInfo AS C ON A.creatorId = C.creatorId
    WHERE A.creatorId = ?
    `;

    const { result } = await doQuery(query, [creatorId]);

    console.log(result);

    if (!result || result.length === 0) {
      responseHelper.send('referral-code is not exists', 'get', res);
    }

    responseHelper.send(result[0], 'get', res);
  }));

export default router;
