import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import dataProcessing from '../../../lib/dataProcessing';
import doQuery from '../../../model/doQuery';
import encrypto from '../../../middlewares/encryption';


const router = express.Router();


router.route('/')
  // 크리에이터 수익금 정보
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const query = `
      SELECT 
      creatorTotalIncome as creatorTotalIncome,
      creatorReceivable as creatorReceivable,
      creatorAccountNumber, creatorIncome.date, creatorContractionAgreement, realName
      FROM creatorInfo as ci
      JOIN creatorIncome 
      ON ci.creatorId = creatorIncome.creatorId
      WHERE ci.creatorId= ? 
      ORDER BY date desc
      LIMIT 1
      `;

      doQuery(query, [creatorId])
        .then(row => {
          const result = row.result[0];
          result.date = result.date.toLocaleString();
          let deciphedAccountNum;
          if (result.creatorAccountNumber) {
            deciphedAccountNum = encrypto.decipher(result.creatorAccountNumber);
          } else {
            deciphedAccountNum = '';
          }
          result.creatorAccountNumber = deciphedAccountNum;
          responseHelper.send(result, 'get', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next)
        }
        )
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/withdrawal')
  // 크리에이터 출금 내역 리스트
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);

      const query = `
      SELECT
      date, creatorWithdrawalAmount, withdrawalState
      FROM creatorWithdrawal
      WHERE creatorId= ?
      ORDER BY date DESC
      `;

      doQuery(query, [creatorId])
        .then(row => {
          console.log(row.result)
          if (row.result.length > 0) {
            const result = dataProcessing.withdrawalList(row);
            responseHelper.send(result, 'get', res);
          } else {
            res.end();
          }
        }).catch((error) => {
          responseHelper.promiseError(error, next)
        }
        )
    }),
  )
  .post(
    // 크리에이터 출금 신청 데이터 생성
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const withdrawlAmount = responseHelper.getParam('withdrawlAmount', 'POST', req)

      const creatorWithdrawalQuery = `
      INSERT INTO creatorWithdrawal
      (creatorId, creatorWithdrawalAmount, withdrawalState)
      VALUES (?, ?, ?)`;

      const creatorIncomeQuery = `
      INSERT INTO creatorIncome 
      (creatorId, creatorTotalIncome, creatorReceivable)
      SELECT creatorId, creatorTotalIncome, creatorReceivable - ?
      FROM creatorIncome
      WHERE creatorId = ?
      ORDER BY date DESC
      LIMIT 1`;

      Promise.all([
        doQuery(creatorWithdrawalQuery, [creatorId, withdrawlAmount, 0]),
        doQuery(creatorIncomeQuery, [withdrawlAmount, creatorId])
      ])
        .then(() => {
          responseHelper.send('done', 'POST', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next)
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;