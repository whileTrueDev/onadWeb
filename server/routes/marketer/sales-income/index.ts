import express from 'express';
import createHttpError from 'http-errors';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = express.Router();

export interface MarketerSalesImcome {
  id: number;
  marketerId: string;
  totalIncome: number;
  receivable: number;
  createDate: string;
}

const findOne = async (marketerId: string,): Promise<MarketerSalesImcome[]> => {
  const query = `SELECT
      id, marketerId, totalIncome, receivable, createDate
      FROM marketerSalesIncome
      WHERE marketerId = ?
      ORDER BY createDate DESC
      LIMIT 1`;
  const queryArray = [marketerId];

  const { result } = await doQuery(query, queryArray);
  return result;
};

const findMany = async (marketerId: string,): Promise<MarketerSalesImcome[]> => {
  const query = `SELECT
      id, marketerId, totalIncome, receivable, createDate
      FROM marketerSalesIncome
      WHERE marketerId = ?
      ORDER BY createDate DESC
      `;
  const queryArray = [marketerId];

  const { result } = await doQuery(query, queryArray);
  return result;
};

router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();

      const result = await findOne(marketerId);
      if (result.length === 0) return responseHelper.send(null, 'get', res);
      return responseHelper.send(result[0], 'get', res);
    })
  )
  .all(responseHelper.middleware.unusedMethod);


router.route('/list')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();

      const result = await findMany(marketerId);
      return responseHelper.send(result, 'get', res);
    })
  )
  .all(responseHelper.middleware.unusedMethod);
export default router;
