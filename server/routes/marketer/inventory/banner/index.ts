import express from 'express';
import responseHelper from '../../../../middlewares/responseHelper';
import doQuery from '../../../../model/doQuery';

const router = express.Router();

// marketer/sub/banner => /registered에서  가져옴
router.get('/list/:status',
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
        const { marketerId } = responseHelper.getSessionData(req);
        const status = req.param('status');
        let query = '';
        switch (status) {
            case 'active':
                query = `
                SELECT bannerId, bannerSrc
                FROM bannerRegistered
                WHERE marketerId = ? AND (confirmState = 0 OR confirmState = 1)
                ORDER BY regiDate DESC 
                `;
                break
        }
        doQuery(query, [marketerId])
            .then((row) => {
                responseHelper.send(row.result, 'get', res);
            })
            .catch((error) => {
                responseHelper.promiseError(error, next);
            })
    }))


// marketer/sub/banner => /all에서  가져옴
router.route('/list')
    .get(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            const query = `
            SELECT bannerSrc, confirmState, bannerId, 
            bannerDenialReason, bannerDescription, 
            DATE_FORMAT(date, "%Y년% %m월 %d일") as date,
            DATE_FORMAT(regiDate, "%Y년% %m월 %d일") as regiDate
            FROM bannerRegistered
            WHERE marketerId = ?
            ORDER BY confirmState ASC, regiDate DESC`;
            doQuery(query, [marketerId])
                .then((row) => {
                    responseHelper.send(row.result, 'get', res);
                })
                .catch((error) => {
                    responseHelper.promiseError(error, next);
                })
        }),
    )
    .all(responseHelper.middleware.unusedMethod)

router.route('/')
    .get(
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const bannerId = responseHelper.getParam("bannerId", "GET", req);
            const query = `
            SELECT *
            FROM campaign
            WHERE bannerId = ? AND deletedState = 0`;
            doQuery(query, [bannerId])
                .then((row) => {
                    responseHelper.send(row.result, 'get', res);
                })
                .catch((error) => {
                    responseHelper.promiseError(error, next);
                })
        }),
    )
    .all(responseHelper.middleware.checkSessionExists)
    .post(
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const [bannerSrc, bannerDescription] = responseHelper.getParam(['bannerSrc', 'bannerDescription'], 'PUT', req);
            const { marketerId } = responseHelper.getSessionData(req);
            const searchQuery = `
            SELECT bannerId 
            FROM bannerRegistered 
            WHERE marketerId = ?  
            ORDER BY regiDate DESC
            LIMIT 1`;

            const saveQuery = `
            INSERT INTO bannerRegistered 
            (bannerId, marketerId, bannerSrc, bannerDescription, confirmState) 
            VALUES (?, ?, ?, ?, 0)`;

            doQuery(searchQuery, [marketerId])
                .then((row) => {
                    // 이전에 배너를 게시한 적이 있다는 의미.
                    let bannerId = '';
                    if (row.result[0]) {
                        const lastBannerId = row.result[0].bannerId;
                        const count = parseInt(lastBannerId.split('_')[1], 10) + 1; // 10 진수
                        if (count < 10) {
                            bannerId = `${marketerId}_0${count}`;
                        } else {
                            bannerId = `${marketerId}_${count}`;
                        }
                    } else {
                        bannerId = `${marketerId}_01`;
                    }
                    doQuery(saveQuery,
                        [bannerId, marketerId, bannerSrc,
                            bannerDescription])
                        .then(() => {
                            responseHelper.send([true], 'POST', res);
                            const MARKETER_ACTION_LOG_TYPE = 2; // <배너 등록> 의 상태값 : 2
                            // marketerActionLogging([
                            //     marketerId, MARKETER_ACTION_LOG_TYPE, JSON.stringify({ bannerId })
                            // ]);
                        })
                        .catch((error) => {
                            responseHelper.promiseError(error, next);
                        });
                })
                .catch((error) => {
                    responseHelper.promiseError(error, next);
                });
        }),
    )
    .delete(
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const bannerId = responseHelper.getParam('bannerId', 'DELETE', req);
            const query = `
            DELETE FROM bannerRegistered 
            WHERE bannerId = ? `;

            doQuery(query, [bannerId])
                .then(() => {
                    responseHelper.send([true], 'DELETE', res);
                    // const MARKETER_ACTION_LOG_TYPE = 11; // <배너 삭제>의 상태값 : 11
                    // marketerActionLogging([marketerId,
                    //     MARKETER_ACTION_LOG_TYPE, JSON.stringify({ bannerId })]);
                })
                .catch((error) => {
                    responseHelper.promiseError(error, next);
                });
        }),
    )
    .all(responseHelper.middleware.unusedMethod)




export default router;
