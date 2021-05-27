import express from 'express';
import createHttpError from 'http-errors';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
import slack from '../../../lib/slack/messageWithJson';

const router = express.Router();


/**
 * 상품판매형(CPS) 캠페인의 주문 목록 반환 라우터
 * @input campaignId: string
 * @returns Rows of `merchandiseOrders` table
 */
router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();

      const [merchandiseId, campaignId] = responseHelper.getOptionalParam(
        ['merchandiseId', 'campaignId'], 'get', req
      );

      const query = `
      SELECT
        mo.id, mo.merchandiseId, campaignId, optionId, status, statusString, orderPrice, ordererName,
        recipientName, quantity, mo.createDate, mo.updateDate, mo.denialReason,
        deliveryMemo, email, jibunAddress, roadAddress, mo.denialReason, zoneCode, phone,
        mr.name, mr.price, stock, optionFlag, mopt.type as optionType, mopt.name as optionValue, mopt.additionalPrice,
        mm.soldCount AS merchandiseSoldCount,
        mor.id AS releaseId, courierCompany, trackingNumber
      FROM merchandiseOrders AS mo
      JOIN merchandiseRegistered AS mr ON mr.id =  mo.merchandiseId
      JOIN merchandiseOrderStatuses AS mos ON mo.status = mos.statusNumber
      LEFT JOIN merchandiseOptions AS mopt ON mo.optionId = mopt.id
      LEFT JOIN merchandiseMallItems AS mm ON mr.id = mm.merchandiseId
      LEFT JOIN merchandiseOrderRelease AS mor ON mo.id = mor.orderId
      `;

      if (merchandiseId) {
        const queryCondition = 'WHERE mo.merchandiseId = ? ORDER BY mo.createDate DESC';
        const { result } = await doQuery(query + queryCondition, [merchandiseId]);
        return responseHelper.send(result, 'get', res);
      }
      if (campaignId) {
        const queryCondition = 'WHERE campaignId = ? ORDER BY mo.createDate DESC';
        const { result } = await doQuery(query + queryCondition, [campaignId]);
        return responseHelper.send(result, 'get', res);
      }
      if (marketerId) {
        const queryCondition = 'WHERE marketerId = ? ORDER BY mo.createDate DESC';
        const { result } = await doQuery(query + queryCondition, [marketerId]);
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
      const [denialReason, courierCompany, trackingNumber] = responseHelper.getOptionalParam(
        ['denialReason', 'courierCompany', 'trackingNumber'], 'patch', req
      );

      // 해당 order가 요청자의 marketerId와 동일한 지 확인을 위해
      const selectQuery = `
      SELECT
        marketerId, quantity, merchandiseRegistered.id AS merchandiseId,
        mor.id AS releaseId, ordererName, merchandiseRegistered.name AS merchandiseName
      FROM merchandiseRegistered
        JOIN merchandiseOrders ON merchandiseRegistered.id = merchandiseOrders.merchandiseId
        LEFT JOIN merchandiseOrderRelease AS mor ON mor.orderId = merchandiseOrders.id
      WHERE merchandiseOrders.id = ?`;
      const orderData = await doQuery(selectQuery, [orderId]);
      if (!orderData.result || orderData.result.length === 0) {
        throw new createHttpError[401]();
      } else {
        const order = orderData.result[0];
        if (order.marketerId === marketerId) {
          const query = 'UPDATE merchandiseOrders SET status = ?, denialReason = ? WHERE id = ?';
          const queryArray = [status, denialReason || null, orderId];

          const { result } = await doQuery(query, queryArray);

          // 출고 완료시 출고 정보 적재
          if (status === 3 && courierCompany && trackingNumber) { // 3 = 출고완료 상태
            let releaseQuery = `INSERT INTO
            merchandiseOrderRelease (orderId, courierCompany, trackingNumber) VALUES (?, ?, ?)`;
            let releaseArray = [orderId, courierCompany, trackingNumber];

            if (order.releaseId) {
              releaseQuery = 'UPDATE merchandiseOrderRelease SET courierCompany = ? trackingNumber = ? WHERE id = ?';
              releaseArray = [courierCompany, trackingNumber, order.releaseId];
            }

            await doQuery(releaseQuery, releaseArray);

            // 슬랙 알림
            slack({
              summary: '[온애드 CPS] 상품 출고 완료 알림',
              text: '광고주가 주문상품을 출고하였습니다. 온애드샵에서 출고 정보를 입력하고, 출고완료 처리를 진행해주세요.',
              fields: [
                { title: '상품명', value: order.merchandiseName, short: true },
                { title: '주문자', value: order.ordererName, short: true },
                { title: '택배사', value: courierCompany, short: true },
                { title: '송장번호', value: trackingNumber, short: true },
              ]
            });
          }

          // 주문 취소시 팔린개수 처리 롤백
          if (status === 5) { // 5 = 주문취소 상태
            const soldCountQuery = `
            UPDATE merchandiseMallItems SET soldCount = soldCount - ? WHERE merchandiseId = ?
            `;
            await doQuery(soldCountQuery, [order.quantity, order.merchandiseId]);
          }

          responseHelper.send(result.affectedRows, 'patch', res);
        }
      }
    })
  );

export default router;
