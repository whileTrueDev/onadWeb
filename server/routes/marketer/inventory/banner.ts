import path from 'path';
import express from 'express';
import createHttpError from 'http-errors';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
import marketerActionLogging from '../../../middlewares/marketerActionLog';
import slack from '../../../lib/slack/messageWithJson';
import { getBaseUrl, uploadImageAsync } from '../../../lib/AWS/S3';
import decodeBase64Banner from '../../../lib/decodeBase64Banner';
// import S3 from '../../../lib/AWS/S3';

const router = express.Router();

// marketer/sub/banner => /registered에서  가져옴
router.route('/list/active')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
        SELECT bannerId, bannerSrcUrl AS bannerSrc
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

/**
 * 마케터의 총 배너 리스트 목록 길이를 반환하는 라우터
 */
router.route('/length')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = 'SELECT COUNT(*) AS rowCount FROM bannerRegistered WHERE marketerId = ?';
      const { result } = await doQuery(query, [marketerId]);
      return responseHelper.send(result[0].rowCount, 'get', res);
    })
  );

// marketer/sub/banner => /all에서  가져옴
router.route('/list')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
            SELECT bannerId AS id, bannerSrcUrl AS bannerSrc, confirmState, bannerId, 
            bannerDenialReason, regiDate
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
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const bannerId = responseHelper.getParam('bannerId', 'get', req);

      const [page, offset] = responseHelper.getParam(['page', 'offset'], 'get', req);
      const searchPage = Number(page * offset);
      const searchOffset = Number(offset);

      const query = 'SELECT * FROM bannerRegistered WHERE marketerId = ? AND bannerId = ? LIMIT ?, ?';

      const { result } = await doQuery(query, [marketerId, bannerId, searchPage, searchOffset]);
      return responseHelper.send(result[0], 'get', res);
    })
  )
  .post(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const [bannerSrc] = responseHelper.getParam(['bannerSrc'], 'POST', req);
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw next(new createHttpError[401]('unauthorized'));

      // * 새로운 배너의 배너_ID에 들어갈 숫자 가져오기
      const searchQuery = `
        SELECT bannerId FROM bannerRegistered WHERE marketerId = ? ORDER BY regiDate DESC LIMIT 1`;
      const bannerPrevious = await doQuery(searchQuery, [marketerId]);

      let bannerId = '';
      if (bannerPrevious.result[0]) {
        const lastBannerId = bannerPrevious.result[0].bannerId;
        const count = parseInt(lastBannerId.split('_')[1], 10) + 1; // 10 진수
        if (count < 10) bannerId = `${marketerId}_0${count}`;
        else bannerId = `${marketerId}_${count}`;
      } else {
        bannerId = `${marketerId}_01`;
      }

      const { contentType, fileExt, bannerImgBuffer } = decodeBase64Banner(bannerSrc);

      const BANNER_FILE_PATH = path.join('banner', marketerId, `${bannerId}.${fileExt}`);
      await uploadImageAsync(BANNER_FILE_PATH, bannerImgBuffer, { ContentType: contentType })
        .catch((err) => {
          throw next(new Error(`Error occurred during upload an banner image to AWS S3 \n${err}`));
        });

      const saveQuery = `
        INSERT INTO bannerRegistered (bannerId, marketerId, bannerSrcUrl, bannerSrc, confirmState)
        VALUES (?, ?, ?, ?, 0)`;

      doQuery(saveQuery,
        [bannerId, marketerId, getBaseUrl() + BANNER_FILE_PATH, ''])
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
            ]
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
