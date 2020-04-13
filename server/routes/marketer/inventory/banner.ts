import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
import marketerActionLogging from '../../../middlewares/marketerActionLog';
import slack from '../../../lib/slack/messageWithJson';
// import S3 from '../../../lib/AWS/S3';

const router = express.Router();

// marketer/sub/banner => /registered에서  가져옴
router.route('/list/active')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
        SELECT bannerId, bannerSrc
        FROM bannerRegistered
        WHERE marketerId = ? AND (confirmState = 0 OR confirmState = 1)
        ORDER BY regiDate DESC 
        `;
      doQuery(query, [marketerId])
        .then((row) => {
          responseHelper.send(row.result, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);


// marketer/sub/banner => /all에서  가져옴
router.route('/list')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
            SELECT bannerSrc, confirmState, bannerId, 
            bannerDenialReason, bannerDescription, 
            DATE_FORMAT(date, "%Y년% %m월 %d일") as date,
            DATE_FORMAT(regiDate, "%Y년% %m월 %d일") as regiDate
            FROM bannerRegistered
            WHERE marketerId = ?
            ORDER BY confirmState ASC, regiDate DESC`;
      doQuery(query, [marketerId])
        .then((row) => {
          responseHelper.send(row.result, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


// marketer/sub/banner => /connectedcampaign에서  가져옴
// marketer/sub/banner => /push

router.route('/')
  .post(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const [bannerSrc, bannerDescription] = responseHelper.getParam(['bannerSrc', 'bannerDescription'], 'PUT', req);
      const { marketerId } = responseHelper.getSessionData(req);
      const searchQuery = `
            SELECT bannerId 
            FROM bannerRegistered 
            WHERE marketerId = ?  
            ORDER BY regiDate DESC
            LIMIT 1`;

      const saveQuery = `
            INSERT INTO bannerRegistered 
            (bannerId, marketerId, bannerSrc, bannerDescription, confirmState) 
            VALUES (?, ?, ?, ?, 0)`;

      doQuery(searchQuery, [marketerId])
        .then((row) => {
          // 이전에 배너를 게시한 적이 있다는 의미.
          let bannerId = '';
          if (row.result[0]) {
            const lastBannerId = row.result[0].bannerId;
            const count = parseInt(lastBannerId.split('_')[1], 10) + 1; // 10 진수
            if (count < 10) {
              bannerId = `${marketerId}_0${count}`;
            } else {
              bannerId = `${marketerId}_${count}`;
            }
          } else {
            bannerId = `${marketerId}_01`;
          }
          // S3에 저장
          // S3.uploadImage(`banner/${marketerId}/${bannerId}`, bannerSrc);
          doQuery(saveQuery,
            [bannerId, marketerId, bannerSrc,
              bannerDescription])
            .then(() => {
              responseHelper.send([true, '배너 등록이 완료되었습니다.'], 'POST', res);
              const MARKETER_ACTION_LOG_TYPE = 2; // <배너 등록> 의 상태값 : 2
              marketerActionLogging([
                marketerId, MARKETER_ACTION_LOG_TYPE, JSON.stringify({ bannerId })
              ]);
              slack({
                summary: '배너 등록 알림',
                text: '관리자 페이지에서 방금 등록된 배너를 확인하고, 심사하세요.',
                fields: [
                  { title: '마케터 아이디', value: marketerId!, short: true },
                  { title: '배너 아이디', value: bannerId!, short: true },
                  { title: '배너 설명', value: bannerDescription!, short: true },
                ]
              });
            })
            .catch((error) => {
              responseHelper.promiseError(error, next);
            });
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .delete(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const bannerId = responseHelper.getParam('bannerId', 'DELETE', req);
      const query = `
            DELETE FROM bannerRegistered 
            WHERE bannerId = ? `;

      doQuery(query, [bannerId])
        .then(() => {
          responseHelper.send([true], 'DELETE', res);
          const MARKETER_ACTION_LOG_TYPE = 11; // <배너 삭제>의 상태값 : 11
          marketerActionLogging([marketerId,
            MARKETER_ACTION_LOG_TYPE, JSON.stringify({ bannerId })]);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


router.route('/campaigns')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const bannerId = responseHelper.getParam('bannerId', 'GET', req);
      const query = `
            SELECT campaignId
            FROM campaign
            WHERE bannerId = ? AND deletedState = 0`;
      doQuery(query, [bannerId])
        .then((row) => {
          responseHelper.send(row.result, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


export default router;
