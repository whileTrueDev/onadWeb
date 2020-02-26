import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
import encrypto from '../../../middlewares/encryption';


const router = express.Router();

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




// marketer/sub/profile => /accountNuber에서 가져옴.
router.route('/account')
    .get(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            if (responseHelper.paramValidationCheck(marketerId, 'marketerId', req)) {
                const query = `
                SELECT marketerAccountNumber, accountHolder
                FROM marketerInfo
                WHERE marketerId = ?`;
                doQuery(query, [marketerId])
                    .then((row) => {
                        const { marketerAccountNumber, accountHolder } = row.result[0];
                        let accountNumber;
                        if (marketerAccountNumber) {
                            accountNumber = encrypto.decipher(marketerAccountNumber);
                        } else {
                            accountNumber = '';
                        }

                        responseHelper.send({
                            accountNumber, accountHolder
                        }, 'get', res);
                    })
                    .catch((error) => {
                        responseHelper.promiseError(error, next);
                    })
            }
        }),
    )
    .all(responseHelper.middleware.unusedMethod)

// marketer/sub/profile => /business, /business/upload 가져옴.
router.route('/business')
    .all(responseHelper.middleware.checkSessionExists)
    .get(
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            if (responseHelper.paramValidationCheck(marketerId, 'marketerId', req)) {
                const query = `
                SELECT marketerBusinessRegNum, marketerBusinessRegSrc
                FROM marketerInfo
                WHERE marketerId = ?`;
                doQuery(query, [marketerId])
                    .then((row) => {
                        responseHelper.send(row.result[0], 'get', res);
                    })
                    .catch((error) => {
                        responseHelper.promiseError(error, next);
                    })
            }
        }),
    )
    .put(
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const businessImageSrc = responseHelper.getParam('imageUrl', 'PUT', req);
            const { marketerId } = responseHelper.getSessionData(req);
            if (responseHelper.paramValidationCheck(marketerId, 'marketerId', req)) {
                const query = `
                UPDATE marketerInfo
                SET marketerBusinessRegSrc = ?
                WHERE marketerId = ?`;
                doQuery(query, [businessImageSrc, marketerId])
                    .then(() => {
                        responseHelper.send([true], 'PUT', res);
                    })
                    .catch((error) => {
                        responseHelper.promiseError(error, next);
                    })
            }
        }),
    )
    .all(responseHelper.middleware.unusedMethod)


interface Taxbill {
    state: string | number;
    cashAmount: string;
}
// marketer/sub/profile => /accountNuber에서 가져옴.
router.route('/tax-bills')
    .get(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            if (responseHelper.paramValidationCheck(marketerId, 'marketerId', req)) {
                const query = `
                SELECT date, cashAmount, state FROM marketerTaxBill
                WHERE marketerId = ?`;
                doQuery(query, [marketerId])
                    .then((row) => {
                        const sendArray: any[] = [];
                        row.result.forEach((obj: Taxbill) => {
                            const object = obj;
                            let taxBillState = '';
                            switch (object.state) {
                                case 0: taxBillState = '발행대기'; break;
                                case 1: taxBillState = '발행완료'; break;
                                case 2: taxBillState = '미발행'; break;
                                default: throw Error('tax bill state');
                            }
                            object.state = taxBillState;
                            object.cashAmount = object.cashAmount.toString();
                            sendArray.push(Object.values(object));
                        });
                        responseHelper.send(sendArray, 'get', res);
                    })
                    .catch((error) => {
                        responseHelper.promiseError(error, next);
                    })
            }
        }),
    )
    .all(responseHelper.middleware.unusedMethod)

router.route('/notification')
    .get(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            if (responseHelper.paramValidationCheck(marketerId, 'marketerId', req)) {
                const callQuery = `
                SELECT 
                mn.index, title, content,
                date_format(date,'%y년 %m월 %d일') AS dateform,
                readState
                FROM marketerNotification AS mn
                WHERE marketerId = ?
                ORDER BY date DESC, readState ASC`;

                const countQuery = `
                SELECT count(*) as count
                FROM marketerNotification
                WHERE marketerId = ? AND readState = 0`;
                const result = { notifications: [{}], unReadCount: 0 };

                doQuery(callQuery, [marketerId])
                    .then((data) => {
                        result.notifications = data.result;
                        doQuery(countQuery, [marketerId])
                            .then((row) => {
                                if (row.result) {
                                    const { count } = row.result[0];
                                    result.unReadCount = count;
                                }
                                responseHelper.send(result, 'get', res);
                            });
                    })
                    .catch((error) => {
                        responseHelper.promiseError(error, next);
                    });
            }
        })
    )
    .patch(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            const index = responseHelper.getParam("index", "PATCH", req);
            if (responseHelper.paramValidationCheck(marketerId, 'marketerId', req)) {
                const query = `
                UPDATE marketerNotification
                SET readState = 1
                WHERE marketerNotification.index = ? AND marketerId = ?`;

                doQuery(query, [index, marketerId])
                    .then(() => {
                        responseHelper.send([true], 'PATCH', res);
                    })
                    .catch((error) => {
                        responseHelper.promiseError(error, next);
                    })
            }
        })
    )
    .all(responseHelper.middleware.unusedMethod)


// marketer/sub/profile => /accountNuber에서 가져옴.

interface Notification {
    title: string;
    content: string;
    data: string;
    readState: number | string;
}

router.route('/notifications')
    .get(
        responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
        responseHelper.middleware.withErrorCatch(async (req, res, next) => {
            const { marketerId } = responseHelper.getSessionData(req);
            if (responseHelper.paramValidationCheck(marketerId, 'marketerId', req)) {
                const query = `
                SELECT title, content, date_format(date,'%y. %m. %d') as date, readState
                FROM marketerNotification AS mn
                WHERE marketerId = ?
                ORDER BY readState`;

                doQuery(query, [marketerId])
                    .then((data) => {
                        const dataArray = data.result.map((value: Notification) => {
                            const returnValue: Notification = { ...value };
                            returnValue.readState = returnValue.readState ? '읽음' : '안읽음';
                            return Object.values(returnValue)
                        });
                        responseHelper.send(dataArray, 'get', res);
                    })
                    .catch((error) => {
                        responseHelper.promiseError(error, next);
                    })
            }
        }),
    )
    .all(responseHelper.middleware.unusedMethod)

export default router;
