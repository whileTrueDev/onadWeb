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
    .post(responseHelper.middleware.unusedMethod)
    .put(responseHelper.middleware.unusedMethod)
    .patch(responseHelper.middleware.unusedMethod)
    .delete(responseHelper.middleware.unusedMethod);



// marketer/sub/profile => /accountNuber에서 가져옴.
router.route('/account')
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
    .post(responseHelper.middleware.unusedMethod)
    .put(responseHelper.middleware.unusedMethod)
    .patch(responseHelper.middleware.unusedMethod)
    .delete(responseHelper.middleware.unusedMethod);



//   // 등록된 사업자 등록증 스캔본 조회
//   // marketerInfo
//   router.get('/business', (req, res) => {
//     const marketerId = req._passport.session.user.userid;
//     const businessRegiQuery = `
//     SELECT marketerBusinessRegNum, marketerBusinessRegSrc
//     FROM marketerInfo
//     WHERE marketerId = ?`;
//     doQuery(businessRegiQuery, [marketerId])
//       .then((row) => {
//         if (!row.error && row.result.length > 0) {
//           res.send(row.result[0]);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//         res.send({});
//       });
//   });


//   // 사업자 등록증 스캔본 업로드
//   // marketerInfo
//   router.post('/business/upload', (req, res) => {
//     const marketerId = req._passport.session.user.userid;
//     const businessRegistrationImageSrc = req.body.imageUrl;

//     const businessRegiQuery = `
//     UPDATE marketerInfo
//     SET marketerBusinessRegSrc = ?
//     WHERE marketerId = ?`;
//     const businessRegiArray = [businessRegistrationImageSrc, marketerId];

//     doQuery(businessRegiQuery, businessRegiArray)
//       .then((row) => {
//         if (!row.error) {
//           res.send([true, '등록되었습니다.']);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         res.end();
//       });
//   });

//   // 마케터 세금계산 정보 조회
//   router.get('/taxbill', (req, res) => {
//     const marketerId = req._passport.session.user.userid;

//     const query = `
//     SELECT date, cashAmount, state FROM marketerTaxBill
//     WHERE marketerId = ?`;

//     const queryArray = [marketerId];

//     doQuery(query, queryArray).then((row) => {
//       const sendArray = [];
//       if (!row.error && row.result) {
//         row.result.forEach((obj) => {
//           const object = obj;

//           let taxBillState = '';
//           switch (object.state) {
//             case 0: taxBillState = '발행대기'; break;
//             case 1: taxBillState = '발행완료'; break;
//             case 2: taxBillState = '미발행'; break;
//             default: throw Error('tax bill state');
//           }

//           object.state = taxBillState;
//           object.cashAmount = object.cashAmount.toString();
//           sendArray.push(Object.values(object));
//         });
//         res.send(sendArray);
//       }
//     });
//   });



export default router;
