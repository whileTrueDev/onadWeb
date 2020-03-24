import express from 'express';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery';

const router = express.Router();

function getQuery(userType: string): string {
  switch (userType) {
    case 'marketerSelect': {
      return (`SELECT noticeReadState 
                FROM marketerInfo 
                WHERE marketerId = ?`);
    }
    case 'creatorSelect': {
      return (`SELECT noticeReadState 
                FROM creatorInfo 
                WHERE creatorId = ?`);
    }
    case 'marketerUpdate': {
      return (`UPDATE marketerInfo
                SET noticeReadState = 1
                WHERE marketerId = ?`);
    }
    case 'creatorUpdate': {
      return (`UPDATE creatorInfo
                SET noticeReadState = 1
                WHERE creatorId = ?`);
    }
    default: { return ''; }
  }
}

router.route('/')
  // 공지사항에 대한 데이터
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const query = `
      SELECT code, topic, title, contents, regiDate
      FROM publicNotice
      ORDER BY code DESC
      `;

      doQuery(query)
        .then((row) => {
          const { result } = row;
          responseHelper.send(result, 'get', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/read')
  // 공지사항 읽음 여부에 대한 정보
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const userType = req.query.type;

      let userId: string | undefined;
      if (userType === 'marketer') {
        const { marketerId } = responseHelper.getSessionData(req);
        userId = marketerId;
      } else {
        const { creatorId } = responseHelper.getSessionData(req);
        userId = creatorId;
      }

      const query = getQuery(`${userType}Select`);

      doQuery(query, [userId])
        .then((row) => {
          const result = row.result[0];
          responseHelper.send(result, 'get', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .patch(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const userType = req.body;

      let userId: string | undefined;
      if (userType === 'marketer') {
        const { marketerId } = responseHelper.getSessionData(req);
        userId = marketerId;
      } else {
        const { creatorId } = responseHelper.getSessionData(req);
        userId = creatorId;
      }

      const query = getQuery(`${userType}Update`);

      doQuery(query, [userId])
        .then((row) => {
          responseHelper.send([true, '공지사항 확인 완료'], 'patch', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


export default router;
