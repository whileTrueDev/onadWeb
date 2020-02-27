import express from 'express';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery'

const router = express.Router();

router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const searchQuery = `
        SELECT creatorId, creatorName, creatorLogo
        FROM creatorInfo
        WHERE creatorContractionAgreement = 1 `;

      doQuery(searchQuery)
        .then((row) => {
          res.sendStatus(200)
        })
        .catch((errorData) => {
          throw new Error(`Error in /creator/list - ${errorData}`)
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod)

export default router;
