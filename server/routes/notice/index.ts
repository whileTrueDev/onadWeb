import express, { response } from 'express';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery';

const router = express.Router();

// 공지사항 라우터

// 공지사항 데이터
router.route('/')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const query = `
      SELECT
        code, topic, title, contents, regiDate
      FROM publicNotice
      ORDER BY code DESC
      `;

      interface NoticeResult {
        code: string | number;
        topic: string | number;
        title: string;
        contents: string;
        regiDate: string | Date;
      }

      const rows = await doQuery<NoticeResult[]>(query);
      const MustRows = rows.result.filter((x: NoticeResult) => x.topic === '필독');
      const NotMustRows = rows.result.filter((x: NoticeResult) => x.topic !== '필독');
      const result = MustRows.concat(NotMustRows);
      responseHelper.send(result, 'get', res);
    })
  )
  .all(responseHelper.middleware.unusedMethod);

// 공지사항 읽음 / 미읽음 데이터
router.route('/read-flag')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { userType, creatorId, marketerId } = responseHelper.getSessionData(req);

      let query = '';
      const queryParam = [];

      if (userType === 'marketer') {
        query = `
          SELECT noticeReadState 
          FROM marketerInfo 
          WHERE marketerId = ?`;
        queryParam.push(marketerId);
      } else if (userType === 'creator') {
        query = `
          SELECT noticeReadState 
          FROM creatorInfo 
          WHERE creatorId = ?`;
        queryParam.push(creatorId);
      }

      interface NoticeReadFlag {
        noticeReadState: number;
      }

      const rows = await doQuery<NoticeReadFlag[]>(query, queryParam);
      if (rows.result) {
        responseHelper.send(rows.result[0], 'get', res);
      }
    })
  )
  .patch(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { userType, creatorId, marketerId } = responseHelper.getSessionData(req);
      let query = '';
      const queryParam = [];

      if (userType === 'marketer') {
        query = `
        UPDATE marketerInfo
        SET noticeReadState = 1
        WHERE marketerId = ?`;
        queryParam.push(marketerId);
      } else if (userType === 'creator') {
        query = `
        UPDATE creatorInfo
        SET noticeReadState = 1
        WHERE creatorId = ?`;
        queryParam.push(creatorId);
      }

      const rows = await doQuery(query, queryParam);

      const { affectedRows } = rows.result;

      if (affectedRows > 0) {
        responseHelper.send('공지사항 읽음처리', 'patch', res);
      } else {
        res.end();
      }
    })
  );

export default router;
