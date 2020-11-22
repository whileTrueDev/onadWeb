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
      ci.settlementState,
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
        .then((row) => {
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
          responseHelper.promiseError(error, next);
        });
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
        .then((row) => {
          if (row.result.length > 0) {
            responseHelper.send(row.result, 'get', res);
          } else {
            res.end();
          }
        }).catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .post(
    // 크리에이터 출금 신청 데이터 생성
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const withdrawalAmount: number = responseHelper.getParam('withdrawalAmount', 'POST', req);

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
        doQuery(creatorWithdrawalQuery, [creatorId, withdrawalAmount, 0]),
        doQuery(creatorIncomeQuery, [withdrawalAmount, creatorId])
      ])
        .then(() => {
          responseHelper.send('done', 'POST', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/chart')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const dateRange = responseHelper.getParam('dateRange', 'get', req);
      const query = `
      SELECT
        DATE_FORMAT(cl.date, "%Y-%m-%d") as date,
        sum(cashToCreator) as cash, type
      FROM campaignLog AS cl
      WHERE creatorId = ?
        AND  cl.date >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE_FORMAT(cl.date, "%Y-%m-%d"), type
      ORDER BY cl.date DESC
      `;

      interface IncomeChartResult {
        date: string;
        cash: number;
        type: 'CPM' | 'CPC';
      }
      const row = await doQuery<IncomeChartResult[]>(query, [creatorId, dateRange]);
      responseHelper.send(row.result, 'get', res);
    })
  );
export default router;
