import express from 'express';
import createHttpError from 'http-errors';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = express.Router();

export interface SalesIncomeWithdrawal {
  id: number;
  marketerId: string;
  amount: number;
  state: number;
  createDate: Date | string;
  doneDate: Date | string;
}
class SalesIncomeWithdrawalService {
  static _tableName = 'marketerSalesIncomeWithdrawal';

  /**
   * 출금 신청 내역 1개를 반환합니다. 찾고자 하는 출금신청의 id가 필요합니다.
   * @param marketerId 마케터 고유 아이디
   * @param widthdrawalId 찾고자 하는 출금 신청 내역의 아이디
   * @returns 출금신청 객체 또는 null을 반환합니다.
   */
  static async findOne(
    marketerId: string, widthdrawalId: string
  ): Promise<SalesIncomeWithdrawal | null> {
    const query = `SELECT * FROM ${this._tableName} WHERE id = ?`;
    const queryArray = [marketerId, widthdrawalId];

    const { result } = await doQuery(query, queryArray);
    if (!result || result.length === 0) return null;
    return result[0];
  }

  /**
   * 출금 신척 내역을 반환합니다. 페이지네이션 제공하지 않습니다.
   * @param marketerId 마케터 고유 아이디
   * @returns 출금신청 객체를 요소로 하는 배열
   */
  static async findMany(marketerId: string): Promise<SalesIncomeWithdrawal[]> {
    const query = `SELECT * FROM ${this._tableName} ORDER BY createDate DESC`;
    const queryArray = [marketerId];

    const { result } = await doQuery(query, queryArray);
    return result;
  }

  /**
   * 출금 신청을 생성합니다.
   * @param marketerId 마케터 고유 아이디
   * @param amount 출금 신청 금액량
   * @returns 생성된 row 수를 반환합니다 1인 경우 생성이 올바르게 되었고, 0인 경우 생성이 되지 않음을 의미합니다.
   */
  static async createOne(marketerId: string, amount: number): Promise<number> {
    const query = `INSERT INTO ${this._tableName} (marketerId, amount) VALUES (?, ?)`;
    const queryArray = [marketerId, amount];

    const { result } = await doQuery(query, queryArray);
    return result.affectedRows;
  }

  /**
   * 출금 신청을 삭제합니다.
   * @param marketerId 마케터 고유 아이디
   * @param withdrawalId 출금 신청의 아이디
   * @returns 삭제된 row 수를 반환합니다 1인 경우 생성이 올바르게 되었고, 0인 경우 생성이 되지 않음을 의미합니다.
   */
  static async deleteOne(marketerId: string, withdrawalId: string): Promise<number> {
    const query = `DELETE FROM ${this._tableName} WHERE marketerId = ? AND id = ? `;
    const queryArray = [marketerId, withdrawalId];

    const { result } = await doQuery(query, queryArray);
    return result.affectedRows;
  }
}

router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      // marketer sales income withdrawal get
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();

      const withdrawalId = responseHelper.getParam('withdrawalId', 'get', req);

      const result = await SalesIncomeWithdrawalService.findOne(marketerId, withdrawalId);
      return responseHelper.send(result, 'get', res);
    })
  )
  .post(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      // marketer sales income withdrawal post
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();

      const amount = responseHelper.getParam('amount', 'post', req);

      const result = await SalesIncomeWithdrawalService.createOne(marketerId, amount);
      return responseHelper.send(result, 'post', res);
    })
  )
  .delete(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      // marketer sales income withdrawal delete
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();

      const withdrawalId = responseHelper.getParam('withdrawalId', 'delete', req);

      const result = await SalesIncomeWithdrawalService.deleteOne(marketerId, withdrawalId);
      return responseHelper.send(result, 'delete', res);
    })
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/list')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      // marketer sales income withdrawal get
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();

      const result = await SalesIncomeWithdrawalService.findMany(marketerId);
      return responseHelper.send(result, 'get', res);
    })
  );
export default router;
