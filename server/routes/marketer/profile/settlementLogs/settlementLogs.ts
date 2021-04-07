import { Router } from 'express';
import responseHelper from '../../../../middlewares/responseHelper';
import doQuery from '../../../../model/doQuery';

const router = Router();

const TABLE_NAME = 'marketerSalesIncomeSettlementLogs';

router.route('/').get(
  responseHelper.middleware.checkSessionExists,
  responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const { marketerId } = responseHelper.getSessionData(req);
    const query = `SELECT
      DATE_FORMAT(doneDate, "%y년 %m월 %d일") as doneDate,
      FORMAT(amount, 0) as amount
    FROM ${TABLE_NAME} WHERE marketerId = ?`;
    const queryArray = [marketerId];

    const { result } = await doQuery(query, queryArray);
    const seldResult = result.map((x: any) => Object.values(x));
    return responseHelper.send(seldResult, 'get', res);
  }),
);

export default router;
