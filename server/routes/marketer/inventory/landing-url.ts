import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import slack from '../../../lib/slack/messageWithJson';
import doQuery from '../../../model/doQuery';

const router = express.Router();

interface UrlData {
  linkId: string;
  marketerId: string;
  denialReason: string;
  links: string;
  regiDate: string;
  updateDate: string;
  confirmState: number;
}

//  marketer/sub/inventory =>/landingurl/all
// test 완료
router.route('/list')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
            SELECT
            linkId, marketerId, confirmState, denialReason,
            links, DATE_FORMAT(regiDate, "%Y년 %m월 %d일") as regiDate, updateDate
            FROM linkRegistered
            WHERE marketerId = ?
            ORDER BY regiDate DESC
            `;
      doQuery(query, [marketerId])
        .then((row) => {
          const result = row.result.map(
            (urlData: UrlData) => ({ ...urlData, links: JSON.parse(urlData.links) })
          );
          responseHelper.send(result, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


//  marketer/sub/inventory =>/landingurl
//  marketer/sub/inventory =>/landingurl/regist
// test 완료
router.route('/')
  .post(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const links = responseHelper.getParam('links', 'POST', req);
      const { marketerId } = responseHelper.getSessionData(req);
      const DEFAULT_CONFIRM_STATE = 0;

      const searchQuery = `
            SELECT linkId
            FROM linkRegistered
            WHERE marketerId = ?
            ORDER BY linkId DESC
            LIMIT 1`;

      const saveQuery = `
            INSERT INTO linkRegistered
            (linkId, marketerId, confirmState, links)
            VALUES (?, ?, ?, ?)
            `;

      doQuery(searchQuery, [marketerId])
        .then((row) => {
          // 이전에 배너를 게시한 적이 있다는 의미.
          let linkId: string;
          if (row.result.length > 0) {
            const lastlinkId = row.result[0].linkId;
            const count = parseInt(lastlinkId.split('_')[2], 10) + 1;
            if (count < 10) {
              linkId = `link_${marketerId}_0${count}`;
            } else {
              linkId = `link_${marketerId}_${count}`;
            }
          } else { // 해당 마케터가 업로드한 첫 url인 경우
            linkId = `link_${marketerId}_01`;
          }

          doQuery(saveQuery,
            [linkId, marketerId, DEFAULT_CONFIRM_STATE, JSON.stringify({ links })])
            .then(() => {
              responseHelper.send([true], 'POST', res);
              slack({
                summary: '랜딩 URL 등록 알림',
                text: '관리자 페이지에서 방금 등록된 랜딩 Url을 확인하고, 심사하세요.',
                fields: [
                  { title: '마케터 아이디', value: marketerId!, short: true },
                  { title: '링크 아이디', value: linkId!, short: true },
                  { title: '링크 개수', value: links.length, short: true },
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
      const linkId = responseHelper.getParam('linkId', 'DELETE', req);
      const query = `
            DELETE FROM linkRegistered 
            WHERE linkId = ?`;

      doQuery(query, [linkId])
        .then(() => {
          responseHelper.send([true], 'DELETE', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

//  marketer/sub/inventory =>/landingurl/connectedcampaign 
router.route('/campaigns')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const linkId = responseHelper.getParam('linkId', 'GET', req);
      const query = `
            SELECT campaignId
            FROM campaign
            WHERE connectedlinkId = ?
            AND deletedState = 0`;
      doQuery(query, [linkId])
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
