import express from 'express';
import doQuery from '../../../model/doQuery';
import responseHelper from '../../../middlewares/responseHelper';

const router = express.Router();

router.route('/')
  .get(
    // responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const searchQuery = `
      SELECT creatorId, creatorName, creatorLogo
      FROM creatorInfo
      WHERE creatorContractionAgreement = 1 `;
      doQuery(searchQuery, [])
        .then((row) => {
          responseHelper.send(row.result, 'get', res);
        })
        .catch((errorData) => {
          throw new Error(`Error in /creators - ${errorData}`)
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod)
export default router;