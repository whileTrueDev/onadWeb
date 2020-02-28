import express from 'express';
import doQuery from '../../../model/doQuery'
import responseHelper from '../../../middlewares/responseHelper';

const router = express.Router();

router.route('/')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const dataString = 'DATE_SUB(NOW(), INTERVAL 60 MONTH)';

      const query = `
                    SELECT SUM(cL.cashFromMarketer / (4 * mD.unitPrice))
                        FROM campaignLog AS cL
                          LEFT JOIN campaign AS cp
                          ON cL.campaignId = cp.campaignId
                            LEFT JOIN marketerDebit AS mD
                            ON cp.marketerId = mD.marketerId
                        WHERE type="CPM" AND cL.date > ${dataString}
                    `;
      doQuery(query)
        .then((row) => {
          if (!row.error && row.result) {
            responseHelper.send(row.result, 'get', res);
          }
        })
        .catch((errorData) => {
          throw new Error(`Error in /banners/impression - ${errorData}`)
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod)

export default router