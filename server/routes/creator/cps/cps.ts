import { Router } from 'express';
import createHttpError from 'http-errors';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = Router();

interface CpsMetaInfoRes {
  income: number; salesCount: number; clickCount: number;
}

/**
 * 특정 방송인의 판매형 광고를 통한 수익금, 판매수량, 클릭 수를 반환합니다.
 * @param creatorId 방송인 고유 아이디
 * @returns { income: 0, salesCount: 0, clickCount: 0 }[]
 */
const getCpsMetaInfo = async (creatorId: string): Promise<CpsMetaInfoRes> => {
  const query = `
  SELECT
    SUM(cashToCreator) AS income,
    COUNT(*) AS salesCount,
    (SELECT COUNT(*) FROM tracking WHERE creatorId = ? AND costType = "CPS") AS clickCount
  FROM campaignLog
  WHERE creatorId = ? AND type = "CPS"`;
  const queryArray = [creatorId, creatorId];
  const { result } = await doQuery(query, queryArray);
  if (!result || result.length === 0) return { income: 0, salesCount: 0, clickCount: 0 };
  return result[0];
};

interface CpsChartData {
  date: string; value: number; type: 'CPS';
}

/**
 * 특정 방송인의 판매수 그래프 데이터를 반환합니다.
 * @param creatorId 방송인 고유 아이디
 * @param dateRange 검색할 데이터 날짜 수
 * @returns { date: Date, value: number; type: 'CPS'}[]
 */
const getCpsChartData = async (creatorId: string, dateRange?: number): Promise<CpsChartData[]> => {
  const query = `
  SELECT
      DATE_FORMAT(cl.date, "%Y-%m-%d") as date,
      sum(cashToCreator) as value, type
    FROM campaignLog AS cl
    WHERE creatorId = ?
      AND  cl.date >= DATE_SUB(NOW(), INTERVAL ? DAY)
        AND type = "CPS"
    GROUP BY DATE_FORMAT(cl.date, "%Y-%m-%d"), type
    ORDER BY cl.date DESC`;
  const queryArray = [creatorId, dateRange || 30];
  const { result } = await doQuery(query, queryArray);
  return result;
};

/**
 * 특정 방송인의 모든 판매 리뷰 목록을 반환합니다.
 * @param creatorId 방송인 고유 아이디
 * @returns merchandiseOrderComments
 */
const getCpsReviews = async (creatorId: string) => {
  const query = `
  SELECT
    MOC.*, MO.orderPrice, optionId, quantity, MO.status,
    MR.id AS merchandiseId, MR.name AS merchandiseName, MR.images, MR.marketerId
    FROM merchandiseOrderComments AS MOC
  JOIN merchandiseOrders AS MO ON MOC.orderId = MO.id
   JOIN merchandiseRegistered AS MR ON MR.id = MO.merchandiseId
  WHERE creatorId = ?
  ORDER BY MOC.createDate DESC`;
  const queryArray = [creatorId];
  const { result } = await doQuery(query, queryArray);
  return result;
};


router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res,) => {
      const { creatorId } = responseHelper.getSessionData(req);
      if (!creatorId) throw new createHttpError[401]('not Authorized');

      const result = await getCpsMetaInfo(creatorId);
      return responseHelper.send(result, 'get', res);
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/chart')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res,) => {
      const { creatorId } = responseHelper.getSessionData(req);
      if (!creatorId) throw new createHttpError[401]('not Authorized');
      const result = await getCpsChartData(creatorId);
      return responseHelper.send(result, 'get', res);
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/reviews')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res,) => {
      const { creatorId } = responseHelper.getSessionData(req);
      if (!creatorId) throw new createHttpError[401]('not Authorized');
      const result = await getCpsReviews(creatorId);
      return responseHelper.send(result, 'get', res);
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
