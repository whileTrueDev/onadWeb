import express from 'express';
import shortid from 'shortid';
import doQuery from '../../../model/doQuery';
import responseHelper from '../../../middlewares/responseHelper';

const router = express.Router();

router.get('/',
  responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const referralCode = responseHelper.getParam('referralCode', 'get', req);
    const query = `
    SELECT creatorId, referralCode, expired, creatorName, afreecaName, loginId
    FROM creatorReferralCode
    JOIN creatorInfo AS c USING(creatorId)
    WHERE referralCode = ?
    `;

    const { result } = await doQuery(query, [referralCode]);

    responseHelper.send(result, 'get', res);
  }));

router.post('/',
  responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const creators = await doQuery('SELECT creatorId FROM creatorInfo WHERE creatorContractionAgreement = 1');

    let query = 'INSERT INTO creatorReferralCode (creatorId, referralCode) VALUES ';

    creators.result.forEach((c: any, idx: number) => {
      query += '(?, ?)';
      if (idx === creators.result.length - 1) query += ' ON DUPLICATE KEY UPDATE creatorId = creatorId;';
      else query += ',';
    });

    const queryArray: any[] = [];
    creators.result.forEach((c: any) => {
      queryArray.push(c.creatorId);
      queryArray.push(shortid.generate());
    });

    await doQuery(query, queryArray);

    responseHelper.send('success!', 'post', res);
  }));

export default router;
