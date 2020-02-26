import express from 'express';
import loginRouter from '../../auth/login';
import logoutRouter from '../../auth/logout';
import responseHelper from '../../../middlewares/responseHelper';
import dataProcessing from '../../../lib/dataProcessing';
import doQuery from '../../../model/doQuery';

const router = express.Router();

// 넣을 uri
// history
// business-license
// account
// tax-bills
// notifications
// notification

// marketer/actionLog에서 가져옴.
router.route('/history')
    .get(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            if (responseHelper.paramValidationCheck(marketerId, 'marketerId', req)) {
                const query = `
                SELECT *
                FROM marketerActionLog
                WHERE marketerId = ?
                ORDER BY date DESC
                LIMIT 100
                `;
                doQuery('SELECT * from creatorIno where creatorId = ?', [marketerId])
                    .then((row) => {
                        responseHelper.send(row.result, 'get', res);
                    })
                    .catch((error) => {
                        responseHelper.promiseError(error, next);
                    })
            }
        }),
    )
    .post(responseHelper.middleware.unusedMethod)
    .put(responseHelper.middleware.unusedMethod)
    .patch(responseHelper.middleware.unusedMethod)
    .delete(responseHelper.middleware.unusedMethod);


export default router;
