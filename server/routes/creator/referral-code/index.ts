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

export default router;
