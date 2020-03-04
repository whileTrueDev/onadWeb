import express from 'express';
import axios from 'axios';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
import historyRouter from './history';

const router = express.Router();

router.use('/history', historyRouter);


//marekter/sub/cash => /
//marekter/sub/cash => /defaultCash
// 테스트 완료
router.route('/')
    .get(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            const query = `
            SELECT FORMAT(cashAmount, 0) as cashAmount,
            DATE_FORMAT(date, '%y년 %m월 %d일 %T') as date
            FROM marketerDebit
            WHERE marketerId = ?
            ORDER BY date DESC
            LIMIT 1`;
            doQuery(query, [marketerId])
                .then((row) => {
                    responseHelper.send(row.result[0], 'get', res);
                })
                .catch((error) => {
                    responseHelper.promiseError(error, next);
                })
        }),
    )
    .all(responseHelper.middleware.unusedMethod)

// marketer/sub/cash =>/refund
// 테스트 완료
router.route('/refund')
    .post(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            const refundCash = responseHelper.getParam('withdrawCash', "POST", req);

            let withFeeRefundCash;
            if (refundCash < 10000) {
                withFeeRefundCash = refundCash - 1000;
            } else {
                withFeeRefundCash = refundCash * 0.9;
            }

            // 현재 마케터의 캐시 보유량 조회
            const currentDebitQuery = `
            SELECT cashAmount as cashAmount
            FROM marketerDebit
            WHERE marketerId = ?
            ORDER BY date DESC
            LIMIT 1`;

            // 마케터 캐시 보유량 수정 ( 환불진행한 만큼 차감 )
            const debitUpdateQuery = `
            UPDATE marketerDebit
            SET cashAmount = ?
            WHERE  marketerId = ?`;

            // 환불 내역에 데이터 적재
            const refundHistoryInsertQuery = `
            INSERT INTO marketerRefund
            (marketerId, cash, marketerRefund.check)
            VALUES (?, ?, ?)`;
            const refundHistoryInsertArray = [marketerId, Number(withFeeRefundCash), 0];
            // const MARKETER_ACTION_LOG_TYPE = 9;
            doQuery(currentDebitQuery, [marketerId])
                .then((row) => {
                    const currentCashAmount = Number(row.result[0].cashAmount);
                    Promise.all([
                        doQuery(refundHistoryInsertQuery, refundHistoryInsertArray),
                        doQuery(debitUpdateQuery, [currentCashAmount - refundCash, marketerId]),
                        // 마케터 활동내역 로깅 테이블 :환불 신청 적재
                        //   marketerActionLogging([marketerId,
                        //     MARKETER_ACTION_LOG_TYPE,
                        //     JSON.stringify({ refundCash })])
                    ])
                        .then(() => {
                            responseHelper.send([true], 'get', res);
                        })
                })
                .catch((error) => {
                    responseHelper.promiseError(error, next);
                })
        }),
    )
    .all(responseHelper.middleware.unusedMethod)


router.route('/charge/card')
    .post(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            const [chargeCashString, chargeType, imp_uid, merchant_uid] = responseHelper.getParam(['chargeCash', 'chargeType', ' imp_uid', 'merchant_uid'], "POST", req);
            const chargeCash = Number(chargeCashString);

            // 결제시스템의 액세스 토큰(access token) 발급 받기 => 결제 위변조를 대조 용도도 포함
            const getToken = await axios({
                url: 'https://api.iamport.kr/users/getToken',
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                data: {
                    imp_key: process.env.IMP_KEY, // REST API키 => import 관리자 페이지에 있음
                    imp_secret: process.env.IMP_SECRET // REST API Secret => import 관리자 페이지에 있음
                }
            });
            const { access_token } = getToken.data.response; // 접속 인증 토큰

            // imp_uid로 아임포트 서버에서 결제 정보 조회
            const getPaymentData = await axios({
                url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
                method: 'get',
                headers: { Authorization: access_token } // 인증 토큰 Authorization header에 추가
            });

            const paymentData = getPaymentData.data.response; // 조회한 결제 정보를 들고 있는 변수
            const { amount, status } = paymentData; // 실제로 사용자가 전송한 금액과 그 상태

            if ((chargeCash * 1.1) === parseInt(amount)) {
                switch (status) {
                    case 'ready':
                        // 가상계좌 발급 시 로직
                        // DB에 가상계좌 발급 정보 저장
                        const {
                            vbank_num, vbank_date, vbank_name, vbank_holder
                        } = paymentData;

                        // 현재 마케터 보유 금액 조회
                        const vbankCurrentDebitQuery = `
                        SELECT cashAmount as cashAmount
                        FROM marketerDebit
                        WHERE marketerId = ?
                        ORDER BY date DESC
                        LIMIT 1
                        `;

                        // 충전 금액 row 한 줄 추가
                        const vbankCashChargeInsertQuery = `
                        INSERT INTO marketerCharge
                        (marketerId, cash, type, merchant_uid, imp_uid, temporaryState, vbanknum, vbankDueDate, vbankName)
                        VALUES (?, ?, ?, ?, ?, 0, ?, (SELECT FROM_UNIXTIME(${vbank_date}, "%Y-%m-%d %h:%i:%s")), ? )
                        `;
                        // 충전 금액 row 한 줄 추가
                        const vbankCashChargeArray = [marketerId, chargeCash, chargeType, merchant_uid, imp_uid, vbank_num, vbank_name];

                        doQuery(vbankCurrentDebitQuery, [marketerId])
                            .then(() => {
                                doQuery(vbankCashChargeInsertQuery, vbankCashChargeArray)
                                    .then(() => {
                                        // 마케터 캐시 충전 쿼리 완료
                                        responseHelper.send({
                                            status: 'vbankIssued',
                                            vbank_num: `${vbank_num}`,
                                            vbank_date: `${vbank_date}`,
                                            vbank_name: `${vbank_name}`,
                                            vbank_holder: `${vbank_holder}`,
                                        }, 'get', res);

                                        // Promise.all[Notification(
                                        //     {
                                        //         userType: 'marketer',
                                        //         type: 'vbankChargeReady',
                                        //         targetId: marketerId,
                                        //         params: {
                                        //             cashAmount: amount,
                                        //             vbankName: vbank_name,
                                        //             vbankNum: vbank_num,
                                        //         },
                                        //         vbankDate: vbank_date
                                        //     }
                                        // )];
                                    })
                                    .catch((error) => {
                                        responseHelper.promiseError(error, next);
                                    });
                            })
                            .catch((error) => {
                                responseHelper.promiseError(error, next);
                            });
                        break;

                    case 'paid':
                        // 계좌이체 및 신용카드 결제 로직
                        // 현재 마케터 보유 캐시량 조회
                        const currentDebitQuery = `
                        SELECT cashAmount as cashAmount
                        FROM marketerDebit
                        WHERE marketerId = ?
                        ORDER BY date DESC
                        LIMIT 1
                        `;

                        // 신용카드 및 계좌이체로 row 한줄 생성
                        const cashChargeInsertQuery = `
                        INSERT INTO marketerCharge
                        (marketerId, cash, type, merchant_uid, imp_uid, temporaryState)
                        VALUES (?, ?, ?, ?, ?, 1)
                        `;

                        // 신용카드 및 계좌이체로 row 한줄 생성
                        const cashChargeArray = [marketerId, chargeCash, chargeType, merchant_uid, imp_uid];

                        // 충전시 기존의 캐시량 + 캐시충전량으로 바로 update
                        const debitUpdateQuery = `
                        UPDATE marketerDebit
                        SET cashAmount = ? 
                        WHERE marketerId = ?`;

                        doQuery(currentDebitQuery, [marketerId])
                            .then((row) => {
                                let currentCashAmount = 0;
                                if (row.result[0]) { // 기존에 marketerDebit에 데이터가 있는 경우
                                    currentCashAmount = Number(row.result[0].cashAmount);
                                }
                                Promise.all([
                                    doQuery(cashChargeInsertQuery, cashChargeArray),
                                    doQuery(debitUpdateQuery, [currentCashAmount + chargeCash, marketerId])
                                ])
                                    .then(() => {
                                        // 마케터 캐시 충전 쿼리 완료
                                        responseHelper.send({ status: 'success', message: '일반 결제 성공' }, 'get', res);
                                    })
                                    .catch((error) => {
                                        responseHelper.promiseError(error, next);
                                    });
                            })
                            .catch((error) => {
                                responseHelper.promiseError(error, next);
                            });
                        break;
                    default:
                        responseHelper.promiseError(new Error('status가 정의되지 않았습니다.'), next);
                        break;
                }
            }
        }),
    )
    .all(responseHelper.middleware.unusedMethod)


// marketer/sub/cash =>/charge
router.route('/charge')
    .post(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            const [chargeCashString, chargeType] = responseHelper.getParam(['chargeCash', 'chargeType'], "POST", req);
            const chargeCash = Number(chargeCashString);

            const cashChargeInsertQuery = `
            INSERT INTO marketerCharge
            (marketerId, cash, type)
            VALUES (?, ?, ?)
            `;
            const cashChargeArray = [marketerId, chargeCash, chargeType];

            Promise.all([
                doQuery(cashChargeInsertQuery, cashChargeArray),
                // marketerActionLogging([marketerId, MARKETER_ACTION_LOG_TYPE,
                //   JSON.stringify({
                //     chargeCash
                //   })])
            ])
                .then(() => {
                    responseHelper.send([true], 'get', res);
                })
                .catch((error) => {
                    responseHelper.promiseError(error, next);
                })
        }),
    )
    .all(responseHelper.middleware.unusedMethod)

router.route('/vbank')
    .post(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);

            const vbankCancleQuery = `
            UPDATE marketerCharge
            SET temporaryState = 2
            WHERE marketerId = ? AND type = ? AND (NOW() > vbankDueDate) AND temporaryState = 0
            `;

            doQuery(vbankCancleQuery, [marketerId, 'vbank'])
                .then(() => {
                    responseHelper.send([true], 'get', res);
                })
                .catch((error) => {
                    responseHelper.promiseError(error, next);
                })
        }),
    )
    .all(responseHelper.middleware.unusedMethod)


export default router;
