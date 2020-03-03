import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = express.Router();


router.route('/')
  .get(
    // 크리에이터 알림 1개의 정보
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const callQuery = `
      SELECT 
        mn.index, title, content,
        date_format(date,'%y년 %m월 %d일') AS dateform,
        readState
      FROM creatorNotification AS mn
      WHERE creatorId = ?
      ORDER BY date DESC, readState ASC
      `;

      const countQuery = `
        SELECT count(*) as count
        FROM creatorNotification
        WHERE creatorId = ? AND readState = 0`;

      const result = { notifications: [{}], unReadCount: 0 };

      doQuery(callQuery, [creatorId])
        .then(data => {
          result.notifications = data.result;
          doQuery(countQuery, [creatorId])
            .then((row) => {
              if (row.result) {
                const { count } = row.result[0];
                result.unReadCount = count;
              }
              responseHelper.send(result, 'get', res);
            });
        }).catch((error) => {
          responseHelper.promiseError(error, next)
        }
        )
    }),
  )
  .patch(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {

      const index: number = responseHelper.getParam('index', 'PATCH', req);

      const callQuery = `UPDATE creatorNotification AS cn 
      SET readState = 1
      WHERE cn.index = ?`;

      doQuery(callQuery, [index])
        .then(() => {
          responseHelper.send([true], 'PATCH', res);
        })
        .catch((err) => {
          responseHelper.promiseError(err, next)
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

interface NotificationData {
  title: string;
  content: string;
  date: string;
  [readState: number]: number
};

type EachNotification<A, B> = [A, A, A, B];

router.route('/list')
  // 크리에이터 알림 목록 조회
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      let dataArray: any;
      let tmpDataArray;
      const callQuery = `
      SELECT title, content, date_format(date,'%y. %m. %d'), readState
      FROM creatorNotification AS cn
      WHERE creatorId = ?
      ORDER BY readState;
      `;

      doQuery(callQuery, [creatorId])
        .then(data => {
          dataArray = data.result.map((value: NotificationData) => Object.values(value));
          tmpDataArray = dataArray;
          tmpDataArray.map((value: EachNotification<string, number>, index: number) => {
            let tmpValue: string | EachNotification<string, number> = value;
            if (value[3] === 0) {
              tmpValue = '안읽음';
            } else if (value[3] === 1) {
              tmpValue = '읽음';
            }
            dataArray[index][3] = tmpValue;
            return false;
          });
          responseHelper.send(dataArray, 'get', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next)
        }
        )
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;