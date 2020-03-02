import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
import dataProcessing from '../../../lib/dataProcessing';
import analysisRouter from './analysis';

const router = express.Router();
router.use('/analysis', analysisRouter);

interface CampaignData {
    campaignId: string;
    campaignName: string;
    optionType: number;
    priorityType: number | string;
    regiDate: string;
    onOff: number;
    bannerSrc: string;
    dailyLimit: number;
}

// 모든 캠페인에 대한 목록을 의미한다.
// marketer/sub/campaign =>/new
router.route('/list')
    .get(
        responseHelper.middleware.checkSessionExists,
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
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
            from campaignLo
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
                        }).catch((error) => {
                            responseHelper.promiseError(error, next);
                        });
                    }
                }).catch((error) => {
                    responseHelper.promiseError(error, next);
                });
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

// 캠페인 온오프 버튼에 대한 라우트
//(PATCH) marketer/sub/campaign =>/onoff
router.route('/on-off')
    .patch(
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const [onoffState, campaignId] = responseHelper.getParam(['onoffState', 'campaignId'], 'PATCH', req);
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
                            })
                            .catch((error) => {
                                responseHelper.promiseError(error, next);
                            })
                    } else if (bannerConfirm === 1) {
                        responseHelper.send([false, 'URL에 대한 승인이 완료되지 않았습니다.'], 'PATCH', res);
                    } else if (linkConfirm === 1) {
                        responseHelper.send([false, '배너에 대한 승인이 완료되지 않았습니다.'], 'PATCH', res);
                    } else {
                        responseHelper.send([false, '배너, URL에 대한 승인이 완료되지 않았습니다.'], 'PATCH', res);
                    }
                })
                .catch((error) => {
                    responseHelper.promiseError(error, next);
                });
        }),
    )
    .all(responseHelper.middleware.unusedMethod)

// 캠페인 생성 및 삭제에 대한 라우트
//(POST) marketer/sub/campaign =>/push 
//(PATCH) marketer/sub/campaign =>/changeName marketer/sub/campaign =>/changeBudget
//(DELETE)  marketer/sub/campaign => /
router.route('/')
    .all(responseHelper.middleware.checkSessionExists)
    .patch(
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const [campaignId, data] = responseHelper.getParam(['campaignId', "data"], 'PATCH', req);
            const { type, value } = data;
            let query: string = '';
            let params: any[] = [];
            switch (type) {
                case 'name':
                    query = `
                    UPDATE campaign 
                    SET campaignName = ? 
                    WHERE campaignId = ? `;
                    params = [value.campaignName, campaignId]
                    break;
                case 'budget':
                    query = ` 
                    UPDATE campaign 
                    SET dailyLimit = ? 
                    WHERE campaignId = ? `;
                    const updateBudget = value.noBudget ? -1 : value.budget;
                    params = [updateBudget, campaignId]
                    break;
            }

            doQuery(query, params)
                .then(() => {
                    responseHelper.send([true], 'DELETE', res);
                })
                .catch((error) => {
                    responseHelper.promiseError(error, next);
                });
        }),
    )
    .post(
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId, marketerName } = responseHelper.getSessionData(req);
            if (responseHelper.paramValidationCheck(marketerId, 'marketerId', req)) {
                const [campaignName, optionType, priorityType, priorityList, selectedTime, dailyLimit,
                    startDate, finDate, keyword, bannerId,
                    mainLandingUrl, sub1LandingUrl, sub2LandingUrl,
                    mainLandingUrlName, sub1LandingUrlName, sub2LandingUrlName] =
                    responseHelper.getParam(['campaignName', 'optionType', 'priorityType',
                        'priorityList', 'selectedTime', 'dailyLimit', 'startDate', 'finDate',
                        'keyword', 'bannerId', 'mainLandingUrl', 'sub1LandingUrl', 'sub2LandingUrl',
                        'mainLandingUrlName', 'sub1LandingUrlName', 'sub2LandingUrlName'], "POST", req);

                const searchQuery = `
                SELECT campaignId
                FROM campaign 
                WHERE marketerId = ?  
                ORDER BY regiDate DESC
                LIMIT 1`;

                const saveQuery = `
                INSERT INTO campaign 
                (campaignId, campaignName, marketerId, 
                bannerId, connectedLinkId, dailyLimit, priorityType, 
                optionType, onOff, targetList, marketerName, 
                keyword, startDate, finDate, selectedTime) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?)`;

                const saveToLinkRegistered = `
                INSERT INTO linkRegistered
                (linkId, marketerId, confirmState, links)
                VALUES (?, ?, ?, ?)
                `;

                dataProcessing.getUrlId(marketerId).then((urlId) => {
                    doQuery(searchQuery, [marketerId])
                        .then((row) => {
                            const linkId = optionType !== '0' ? `link_${urlId}` : null;
                            const campaignId = dataProcessing.getCampaignId(row.result[0], marketerId);
                            const targetJsonData = JSON.stringify({ targetList: priorityList });
                            const timeJsonData = JSON.stringify({ time: selectedTime });
                            const landingUrlJsonData = JSON.stringify(
                                {
                                    links:
                                        [{
                                            linkName: mainLandingUrlName,
                                            linkTo: mainLandingUrl,
                                            primary: true,
                                        },
                                        (sub1LandingUrl
                                            ? {
                                                linkName: sub1LandingUrlName,
                                                linkTo: sub1LandingUrl,
                                                primary: false,
                                            } : null
                                        ),
                                        (sub2LandingUrl
                                            ? {
                                                linkName: sub2LandingUrlName,
                                                linkTo: sub2LandingUrl,
                                                primary: false,
                                            } : null
                                        ),
                                        ].filter(Boolean)
                                }
                            );
                            const keywordsJsonData = JSON.stringify(
                                { keywords: keyword }
                            );

                            // 마케터 활동내역 로깅 테이블에서, 캠페인 생성의 상태값
                            const MARKETER_ACTION_LOG_TYPE = 5;
                            Promise.all([
                                doQuery(saveQuery,
                                    [campaignId, campaignName, marketerId, bannerId, linkId, dailyLimit,
                                        priorityType, optionType, targetJsonData, marketerName, keywordsJsonData,
                                        startDate, finDate, timeJsonData]),
                                (optionType !== '0'
                                    ? doQuery(saveToLinkRegistered, [linkId, marketerId, 0, landingUrlJsonData]) : null),
                                dataProcessing.PriorityDoquery({
                                    campaignId, priorityType, priorityList, optionType
                                }),
                                dataProcessing.LandingDoQuery({
                                    campaignId, optionType, priorityType, priorityList
                                }),
                                // 마케터 활동내역 테이블 적재.
                                // marketerActionLogging([
                                //     marketerId, MARKETER_ACTION_LOG_TYPE, JSON.stringify({ campaignName })
                                // ]),
                            ])
                                .then(() => {
                                    responseHelper.send([true], 'POST', res);

                                })
                                .catch((error) => {
                                    responseHelper.promiseError(error, next);
                                });
                        })
                        .catch((error) => {
                            responseHelper.promiseError(error, next);

                        });
                }).catch((error) => {
                    responseHelper.promiseError(error, next);

                });
            }
        }),
    )
    .delete(
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            const campaignId = responseHelper.getParam('campaignId', "DELETE", req);
            if (responseHelper.paramValidationCheck(marketerId, 'marketerId', req)) {
                const query = `
                UPDATE campaign
                SET deletedState = 1 ,
                onOFF = 0
                WHERE campaignId = ?`;

                const selectQuery = `
                SELECT campaignName FROM campaign WHERE campaignId = ?`;
                doQuery(query, [campaignId])
                    .then(() => {
                        doQuery(selectQuery, [campaignId])
                            .then(() => {
                                responseHelper.send([true], 'DELETE', res);
                                // const { campaignName } = row1.result[0];
                                // marketer action log 테이블 적재
                                // const MARKETER_ACTION_LOG_TYPE = 12; // <캠페인 삭제> 상태값
                                // marketerActionLogging([marketerId,
                                // MARKETER_ACTION_LOG_TYPE, JSON.stringify({ campaignName })]);
                            })
                            .catch((error) => {
                                responseHelper.promiseError(error, next);
                            });
                    })
                    .catch((error) => {
                        responseHelper.promiseError(error, next);
                    });

            }
        })
    )
    .all(responseHelper.middleware.unusedMethod)

export default router;
