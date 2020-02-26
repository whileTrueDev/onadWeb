import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = express.Router();

interface CampaignData {
    campaignId: string;
    campaignName: string;
    optionType: number;
    priorityType: number;
    regiDate: string;
    onOff: number;
    bannerSrc: string;
    dailyLimit: number;
}
// marketer/actionLog에서 가져옴.
router.route('/list')
    .get(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            if (responseHelper.paramValidationCheck(marketerId, 'marketerId', req)) {
                const date = new Date();
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);

                const query = `
                SELECT
                campaignId, campaignName, optionType, priorityType, campaign.regiDate, onOff, bannerSrc, dailyLimit
                FROM campaign
                JOIN bannerRegistered AS br
                ON br.bannerId = campaign.bannerId
                WHERE campaign.marketerId = ?
                AND deletedState = 0
                ORDER BY br.regiDate DESC
                `;

                const sumQuery = `
                select sum(cashFromMarketer) as dailysum
                from campaignLog
                where campaignId = ?
                and date > ?
                `;
                doQuery(query, [marketerId])
                    .then((row) => {
                        if (row.result) {
                            Promise.all(
                                row.result.map((campaignData: CampaignData) => doQuery(sumQuery, [campaignData.campaignId, date])
                                    .then((inrow) => {
                                        const { dailysum } = inrow.result[0];
                                        return { ...campaignData, dailysum };
                                    }))
                            ).then((campaignList) => {
                                responseHelper.send(campaignList, 'get', res);
                            });
                        }
                    }).catch((error) => {
                        responseHelper.promiseError(error, next);
                    });
            }
        }),
    )
    .all(responseHelper.middleware.unusedMethod)

//캠페인 생성시에 캠페인 중복제거를 위한 name list추출.
router.route('/names')
    .get(
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            doQuery('SELECT campaignName FROM campaign', [])
                .then((row) => {
                    const nameList = row.result.map((inrow: any) => inrow.campaignName);
                    responseHelper.send(nameList, 'get', res);
                })
                .catch((error) => {
                    responseHelper.promiseError(error, next);
                });
        })
    )
    .all(responseHelper.middleware.unusedMethod)

router.route('/chart')
    .get(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            if (responseHelper.paramValidationCheck(marketerId, 'marketerId', req)) {
                const query = `
                SELECT
                DATE_FORMAT(max(cl.date), "%Y-%m-%d") as date,
                sum(cashFromMarketer) as cash, type
                FROM campaignLog AS cl
                WHERE SUBSTRING_INDEX(cl.campaignId, '_', 1) = ?
                AND  cl.date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
                ORDER BY cl.date DESC
                `;
                doQuery(query, [marketerId])
                    .then((row) => {
                        responseHelper.send(row.result, 'get', res);
                    })
                    .catch((error) => {
                        responseHelper.promiseError(error, next);
                    })
            }
        }),
    )
    .all(responseHelper.middleware.unusedMethod)

router.route('/on-off')
    .patch(
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const [onoffState, campaignId] = responseHelper.getParam(['onoffState', 'campaignId'], 'PATCH', req);
            const { marketerId } = responseHelper.getSessionData(req);
            if (responseHelper.paramValidationCheck(marketerId, 'marketerId', req)) {
                const query = `
                UPDATE campaign
                SET onOff = ?
                WHERE campaignId = ?`;

                const selectQuery = `
                SELECT campaignName, CPB.bannerId, CPB.bannerConfirm, IR.confirmState as linkConfirm
                FROM
                (SELECT campaignName, CP.bannerId, connectedLinkId, confirmState as bannerConfirm
                FROM 
                (SELECT campaignName, bannerId, connectedLinkId 
                FROM campaign 
                WHERE campaignId = ?
                ) AS CP
                LEFT JOIN bannerRegistered as BR
                ON BR.bannerId = CP.bannerId
                ) AS CPB
                LEFT JOIN linkRegistered as IR
                ON CPB.connectedLinkId = IR.linkId`;

                doQuery(selectQuery, [campaignId])
                    .then((row) => {
                        const { campaignName, bannerConfirm, linkConfirm } = row.result[0];
                        if ((bannerConfirm === 1 && linkConfirm === 1) || (bannerConfirm === 1 && linkConfirm === null)) {
                            doQuery(query, [onoffState, campaignId])
                                .then(() => {
                                    // const MARKETER_ACTION_LOG_TYPE = 6;
                                    // marketerActionLogging([campaignId.split('_')[0], MARKETER_ACTION_LOG_TYPE,
                                    // JSON.stringify({ campaignName, onoffState })]);
                                    responseHelper.send([true], 'PATCH', res);
                                });
                        } else if (bannerConfirm === 1) {
                            responseHelper.send([false, 'URL에 대한 승인이 완료되지 않았습니다.'], 'PATCH', res);
                            res.send();
                        } else if (linkConfirm === 1) {
                            responseHelper.send([false, '배너에 대한 승인이 완료되지 않았습니다.'], 'PATCH', res);
                        } else {
                            responseHelper.send([false, '배너, URL에 대한 승인이 완료되지 않았습니다.'], 'PATCH', res);
                        }
                    })
                    .catch((error) => {
                        responseHelper.promiseError(error, next);
                    });
            }
        }),
    )
    .all(responseHelper.middleware.unusedMethod)


router.route('/')
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
                doQuery(query, [marketerId])
                    .then((row) => {
                        responseHelper.send(row.result, 'get', res);
                    })
                    .catch((error) => {
                        responseHelper.promiseError(error, next);
                    })
            }
        }),
    )
    .all(responseHelper.middleware.unusedMethod)


export default router;
