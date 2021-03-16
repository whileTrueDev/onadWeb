import express from 'express';
import createHttpError from 'http-errors';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = express.Router();


/**
 * 상품판매형(CPS) 캠페인의 주문 목록 반환 라우터
 * @input campaignId: string
 * @returns Rows of `merchandiseOrders` table
 */
router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();

      const [merchandiseId, marketerIdParam, campaignId] = responseHelper.getOptionalParam(
        ['merchandiseId', 'marketerId', 'campaignId'], 'get', req
      );

      if (!(merchandiseId || marketerIdParam || campaignId)) throw new createHttpError[400]();

      const query = `
      SELECT
        mo.id, mo.merchandiseId, campaignId, optionId, status, orderPrice, ordererName, recipientName, quantity, mo.createDate,
        mr.name, mr.price, stock, optionFlag, mopt.type as optionType, mopt.name as optionValue, mopt.additionalPrice,
        mm.soldCount AS merchandiseSoldCount
      FROM merchandiseOrders AS mo
      JOIN merchandiseRegistered AS mr ON mr.id =  mo.merchandiseId
      LEFT JOIN merchandiseOptions AS mopt ON mo.optionId = mopt.id
      LEFT JOIN merchandiseMallItems AS mm ON mr.id = mm.merchandiseId
       `;

      if (merchandiseId) {
        const queryCondition = 'WHERE mo.merchandiseId = ?';
        const { result } = await doQuery(query + queryCondition, [merchandiseId]);
        return responseHelper.send(result, 'get', res);
      }
      if (campaignId) {
        const queryCondition = 'WHERE campaignId = ?';
        const { result } = await doQuery(query + queryCondition, [campaignId]);
        return responseHelper.send(result, 'get', res);
      }
      if (marketerIdParam) {
        const queryCondition = 'WHERE marketerId = ?';
        const { result } = await doQuery(query + queryCondition, [marketerIdParam]);
        return responseHelper.send(result, 'get', res);
      }
    })
  )
  .patch(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();

      const [orderId, status] = responseHelper.getParam(['orderId', 'status'], 'patch', req);

      // 해당 order가 요청자의 marketerId와 동일한 지 확인을 위해
      const selectQuery = `
      SELECT marketerId FROM merchandiseRegistered
      JOIN merchandiseOrders ON merchandiseRegistered.id = merchandiseOrders.merchandiseId
      where merchandiseOrders.id = ?`;
      const merchandiseMarketerIdQuery = await doQuery(selectQuery, [orderId]);
      if (!merchandiseMarketerIdQuery.result || merchandiseMarketerIdQuery.result.length === 0) {
        throw new createHttpError[401]();
      } else {
        const marketer = merchandiseMarketerIdQuery.result[0];
        if (marketer.marketerId === marketerId) {
          const query = 'UPDATE merchandiseOrders SET status = ? WHERE id = ?';
          const queryArray = [status, orderId];

          const { result } = await doQuery(query, queryArray);

          responseHelper.send(result.affectedRows, 'patch', res);
        }
      }
    })
  );

export default router;
