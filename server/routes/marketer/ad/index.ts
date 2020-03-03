import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
import analysisRouter from './analysis';
const router = express.Router();

router.use('/analysis', analysisRouter);

// 대시보드 - 마케터의 보유 캐시량, 총 소진 비용
// marketer/marketer =>/normal
// test 완료
router.route('/')
    .get(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);

            const query = `SELECT cashAmount, spendAll FROM
            (
                SELECT cashAmount
                FROM marketerDebit
                WHERE marketerId = ?) AS cashAmount,
            (
                SELECT sum(cashFromMarketer) AS spendAll
                FROM campaignLog
                WHERE SUBSTRING_INDEX(campaignId, "_" , 1) = ?) AS spendAll
            `;
            doQuery(query, [marketerId, marketerId])
                .then((row) => {
                    responseHelper.send(row.result[0], 'get', res);
                }).catch((error) => {
                    responseHelper.promiseError(error, next);
                });
        }),
    )
    .all(responseHelper.middleware.unusedMethod)

// 캠페인 ONOFF
// marketer/marketer =>/onoff
// test 완료
router.route('/on-off')
    .get(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            const query = `
            SELECT marketerContraction
            FROM marketerInfo
            WHERE marketerId = ?
            `;
            doQuery(query, [marketerId])
                .then((row) => {
                    const onOffState = row.result[0].marketerContraction === 1;
                    responseHelper.send({ onOffState }, 'get', res);
                }).catch((error) => {
                    console.log(error);
                    responseHelper.promiseError(error, next);
                });
        }),
    )
    .post(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            const onOffState = responseHelper.getParam('onOffState', 'POST', req);
            const contractionState = onOffState === false ? 0 : 1;
            const costQuery = `
            SELECT cashAmount
            FROM marketerDebit
            WHERE marketerId = ?
            LIMIT 1
            `;

            const infoQuery = `
            UPDATE marketerInfo
            SET marketerContraction = ?
            WHERE marketerId = ?
            `;
            doQuery(costQuery, [marketerId])
                .then((row) => {
                    const debit = row.result[0].cashAmount;
                    if (debit === 0) {
                        responseHelper.send([false, '잔액이 부족합니다'], 'POST', res);
                    } else {
                        // 마케터 활동내역 테이블 적재: 마케터 onoff를 위한 상태값
                        const MARKETER_ACTION_LOG_TYPE = 7;
                        Promise.all([
                            doQuery(infoQuery, [contractionState, marketerId]),
                            // 마케터 활동내역 테이블 적재
                            // marketerActionLogging([marketerId, MARKETER_ACTION_LOG_TYPE,
                            //     JSON.stringify({
                            //     onoffState: contractionState // on: 1, off : 0
                            //     })])
                        ])
                            .then(() => {
                                responseHelper.send([true], 'POST', res);
                            })
                            .catch((error) => {
                                responseHelper.promiseError(error, next);
                            });
                    }
                })
                .catch((error) => {
                    responseHelper.promiseError(error, next);
                });
        }),
    )
    .all(responseHelper.middleware.unusedMethod)


// 마케터의 캠페인을 송출하는 크리에이터 중에서 현재 방송중임을 보여주기 위해서
// marketer/marketer =>/broadcast/creator
// test 완료
router.route('/creator/list')
    .get(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            const tenMinuteAgoTime = new Date();
            tenMinuteAgoTime.setMinutes(tenMinuteAgoTime.getMinutes() - 10);
            const query = `
            SELECT streamerName, creatorTwitchId, viewer FROM twitchStreamDetail
                JOIN creatorInfo
                ON creatorInfo.creatorName = twitchStreamDetail.streamerName
                JOIN campaignTimestamp
                ON campaignTimestamp.creatorId = creatorInfo.creatorId
                WHERE TIME > ? 
                AND creatorInfo.creatorContractionAgreement = 1
                AND campaignTimestamp.date > ?
                AND substring_index(campaignTimestamp.campaignId, "_", 1) = ?`;
            doQuery(query, [tenMinuteAgoTime, tenMinuteAgoTime, marketerId])
                .then((row) => {
                    const result = row.result.map((d: any) => d.streamerName);
                    responseHelper.send(result, 'get', res);
                })
                .catch((error) => {
                    responseHelper.promiseError(error, next);
                });
        }),
    )


export default router;