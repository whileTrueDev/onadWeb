import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = express.Router();

// marekter/sub/cash => /charge/list
// 마케터 광고캐시 충전 내역 리스트
// { columns: ['날짜', '충전금액', '결제수단'], data: [ [ '19년 07월 06일', '10000', '계좌이체'], [] ] }
interface ChargeData {
    date: string;
    cash: number | string;
    type: string;
    temporaryState: number | string;
}

// marketer/sub/cash =>/charge/list
router.route('/charge')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
            SELECT 
              DATE_FORMAT(date, '%y년 %m월 %d일 %T') as date,
              FORMAT(ROUND(cash), 0) as cash, type, temporaryState
            FROM marketerCharge
            WHERE marketerId = ? 
            ORDER BY date DESC`;
      doQuery(query, [marketerId])
        .then((row) => {
          const sendArray: any[] = [];
          row.result.forEach((obj: ChargeData) => {
            const object = obj;
            object.cash = String(obj.cash);
            if (object.type === 'vbank') {
              object.type = '가상계좌';
            } else if (object.type === 'trans') {
              object.type = '계좌이체';
            } else if (object.type === 'card') {
              object.type = '신용카드';
            }
            switch (object.temporaryState) {
              case 1:
                object.temporaryState = '완료됨';
                break;
              case 2:
                object.temporaryState = '취소됨';
                break;
              default:
                object.temporaryState = '진행중';
                break;
            }
            sendArray.push(Object.values(object));
          });
          responseHelper.send({ data: sendArray }, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


// marekter/sub/cash => /refund/list
// 마케터 광고캐시 환불 내역 리스트
// { columns: [ '날짜', '환불금액' '환불상태' ], data: [ [ '19년 07월 06일', '0', '0', '진행중' ], [] ] }
router.route('/refund')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
            SELECT
                DATE_FORMAT(date, '%y년 %m월 %d일 %T') as date,
                FORMAT(cash, 0) as cash, marketerRefund.check
            FROM marketerRefund
            WHERE marketerId = ?
            ORDER BY date DESC`;
      doQuery(query, [marketerId])
        .then((row) => {
          const sendArray: any[] = [];
          row.result.forEach((obj: any) => {
            const object = obj;
            object.check = object.check === 0 ? '진행중' : '완료됨';
            sendArray.push(Object.values(object));
          });
          responseHelper.send({ data: sendArray }, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

// marekter/sub/cash => /usage/month
// 마케터 광고 캐시 소진 내역
// { columns: ['날짜', '소진금액', '세금계산서 발행 여부'], data: [ [], [] ] }]
// 테스트 완료
router.route('/usage/month')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const month = responseHelper.getParam('month', 'GET', req);
      const selectQuery = `
            SELECT
                DATE_FORMAT(cl.date, "%y년 %m월 %d일") as date,
                FORMAT(sum(cashFromMarketer), 0) as cash, type
            FROM campaignLog AS cl
              WHERE SUBSTRING_INDEX(cl.campaignId, '_', 1) = ?
              AND DATE_FORMAT(cl.date, "%y년 %m월") = ?
              AND type != "CPS"
            GROUP BY DATE_FORMAT(cl.date, "%y년 %m월 %d일"), type
            ORDER BY cl.date DESC
            `;

      const selectMetaQuery = `
            SELECT
                type, FORMAT(sum(cashFromMarketer), 0) as cash
            FROM campaignLog AS cl
              WHERE SUBSTRING_INDEX(cl.campaignId, '_', 1) = ?
              AND DATE_FORMAT(cl.date, "%y년 %m월") = ?
              AND type != "CPS"
            GROUP BY DATE_FORMAT(cl.date, "%y년 %m월"), type
            ORDER BY type DESC
            `;
      Promise.all([
        doQuery(selectQuery, [marketerId, month]),
        doQuery(selectMetaQuery, [marketerId, month])
      ])
        .then(([usageData, metaData]) => {
          const sendArray: any[] = usageData.result.map((obj: any) => Object.values(obj));
          const sendMetaArray: any[] = metaData.result;
          responseHelper.send({ data: sendArray, metaData: sendMetaArray }, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


// marekter/sub/cash => /usage
// 마케터 광고 캐시 소진 내역
// { columns: ['날짜', '소진금액', '세금계산서 발행 여부'], data: [ [], [] ] }
// 테스트 완료
router.route('/usage')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
      SELECT
          DATE_FORMAT(cl.date, "%y년 %m월") as date,
          FORMAT(sum(cashFromMarketer), 0) as cash
      FROM campaignLog AS cl
      WHERE SUBSTRING_INDEX(cl.campaignId, '_', 1) = ? AND type != "CPS"
      GROUP BY month(cl.date)
      ORDER BY cl.date DESC`;

      doQuery(query, [marketerId])
        .then((row) => {
          const sendArray: any[] = [];
          row.result.forEach((obj: any) => {
            const object = obj;
            switch (object.state) {
              case 0: { object.state = '발행대기'; break; }
              case 1: { object.state = '발행완료'; break; }
              case 2: { object.state = '미발행'; break; }
              default: break;
            }
            sendArray.push(Object.values(obj));
          });
          responseHelper.send({ data: sendArray }, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
