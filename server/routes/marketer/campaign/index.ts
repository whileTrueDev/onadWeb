import express from 'express';
import slack from '../../../lib/slack/messageWithJson';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
import dataProcessing from '../../../lib/dataProcessing';
import analysisRouter from './analysis_v1';
import analysisV2Router from './analysis_v2';
import marketerActionLogging from '../../../middlewares/marketerActionLog';
import { getCampaign, getCampaigns } from './campaignFuncs';

const router = express.Router();
router.use('/analysis/v1', analysisRouter);
router.use(['/analysis', '/analysis/v2'], analysisV2Router);

/**
 * 마케터의 캠페인 목록 총 길이를 반환하는 라우터
 */
router
  .route('/length')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query =
        'SELECT COUNT(*) AS rowCount FROM campaign WHERE campaign.marketerId = ? AND deletedState = 0';
      const { result } = await doQuery(query, [marketerId]);
      if (!result) return responseHelper.send(0, 'get', res);

      return responseHelper.send(result[0].rowCount, 'get', res);
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

// 모든 캠페인에 대한 목록을 의미한다.
// marketer/sub/campaign =>/new
// 테스트 완료
router
  .route('/list')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const [page, offset] = responseHelper.getParam(['page', 'offset'], 'get', req);
      const searchPage = Number(page * offset);
      const searchOffset = Number(offset);

      const result = await getCampaigns({ marketerId: marketerId!, searchPage, searchOffset });

      return responseHelper.send(result, 'GET', res);
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

// 켜져있는 캠페인 수
router.route('/active').get(
  responseHelper.middleware.checkSessionExists,
  responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const { marketerId } = responseHelper.getSessionData(req);
    const query = `
      SELECT COUNT(campaignId) AS activeCampaignCount FROM campaign WHERE onOff = 1 AND marketerId = ?`;
    const { result } = await doQuery(query, [marketerId]);
    if (result.length > 0) {
      responseHelper.send(result[0], 'get', res);
    } else {
      responseHelper.send(0, 'get', res);
    }
  }),
);

// 캠페인 생성시에 캠페인 중복제거를 위한 name list추출.
// 테스트 완료
router
  .route('/names')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      doQuery('SELECT campaignName FROM campaign', [])
        .then(row => {
          const nameList = row.result.map((inrow: any) => inrow.campaignName);
          responseHelper.send(nameList, 'get', res);
        })
        .catch(error => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

// 캠페인 온오프 버튼에 대한 라우트
// (PATCH) marketer/sub/campaign =>/onoff
// 테스트 완료
router
  .route('/on-off')
  .patch(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const [onoffState, campaignId] = responseHelper.getParam(
        ['onoffState', 'campaignId'],
        'PATCH',
        req,
      );
      const query = `
            UPDATE campaign
            SET onOff = ?
            WHERE campaignId = ?`;

      const selectQuery = `
            SELECT campaignName, CPB.bannerId, CPB.bannerConfirm, IR.confirmState as linkConfirm
            FROM
            (SELECT campaignName, CP.bannerId, connectedLinkId, confirmState as bannerConfirm
            FROM 
            (SELECT campaignName, bannerId, connectedLinkId 
            FROM campaign 
            WHERE campaignId = ?
            ) AS CP
            LEFT JOIN bannerRegistered as BR
            ON BR.bannerId = CP.bannerId
            ) AS CPB
            LEFT JOIN linkRegistered as IR
            ON CPB.connectedLinkId = IR.linkId`;

      doQuery(selectQuery, [campaignId])
        .then(row => {
          const { campaignName, bannerConfirm, linkConfirm } = row.result[0];
          if (
            (bannerConfirm === 1 && linkConfirm === 1) ||
            (bannerConfirm === 1 && linkConfirm === null)
          ) {
            doQuery(query, [onoffState, campaignId])
              .then(() => {
                const MARKETER_ACTION_LOG_TYPE = 6;
                marketerActionLogging([
                  campaignId.split('_')[0],
                  MARKETER_ACTION_LOG_TYPE,
                  JSON.stringify({ campaignName, onoffState }),
                ]);
                responseHelper.send([true], 'PATCH', res);
              })
              .catch(error => {
                responseHelper.promiseError(error, next);
              });
          } else if (bannerConfirm === 1) {
            responseHelper.send([false, 'URL에 대한 승인이 완료되지 않았습니다.'], 'PATCH', res);
          } else if (linkConfirm === 1) {
            responseHelper.send([false, '배너에 대한 승인이 완료되지 않았습니다.'], 'PATCH', res);
          } else {
            responseHelper.send(
              [false, '배너, URL에 대한 승인이 완료되지 않았습니다.'],
              'PATCH',
              res,
            );
          }
        })
        .catch(error => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router
  .route('/')
  .get(
    // responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      const campaignId = responseHelper.getParam('campaignId', 'get', req);
      const result = await getCampaign(campaignId);
      return responseHelper.send(result, 'get', res);
    }),
  )
  .patch(
    // 캠페인 정보 변경
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const [campaignId, data, type] = responseHelper.getParam(
        ['campaignId', 'data', 'type'],
        'PATCH',
        req,
      );

      // ************************************************************************
      // 캠페인 이름 변경
      if (type === 'name') {
        const query = 'UPDATE campaign SET campaignName = ? WHERE campaignId = ?';
        const params = [data.campaignName, campaignId];
        await doQuery(query, params);
        responseHelper.send([true], 'PATCH', res);
      }
      // ************************************************************************
      // 캠페인 일일 예산 변경
      if (type === 'budget') {
        // 현재 총 사용량
        const getCampaignImformationQuery = `
        SELECT sum(cashFromMarketer) AS count, limitState
          FROM campaignLog
          JOIN campaign ON campaign.campaignId = campaignLog.campaignId
          WHERE campaignLog.campaignId = ?
            AND DATE(campaignLog.date) = DATE(?)
        `;
        const getCampaignImformationArray = [campaignId, new Date()];

        const dayAmount = await doQuery(getCampaignImformationQuery, getCampaignImformationArray);

        if (dayAmount.result) {
          const { count, limitState } = dayAmount.result[0];

          const query = 'UPDATE campaign SET dailyLimit = ?, limitState = ? WHERE campaignId = ?';
          let queryArray = [];
          if (count >= data.budget) {
            if (limitState === 1) {
              // 현재까지 사용한 광고 금액이 바꿀 예산보다 큰 경우
              // ex) 기존 설정 값 (30,000) → 변경 값 (50,000)이고, 현재 30,000을 사용
              // 예산 변경 적용, limitState를 1 -> 0으로 변경
              queryArray = [data.budget, 0, campaignId];
            } else {
              // 현재까지 사용한 광고 금액이 바꿀 예산보다 큰 경우
              // ex) 기존 설정 값 (30,000) → 변경 값 (20,000)이고, 현재 20,001원을 사용
              queryArray = [data.budget, 1, campaignId];
            }
          } else {
            // 현재 사용한 금액이 바꿀 예산보다 작은 경우
            // ex) 기존 설정 값 (30,000) → 변경 값 (20,000)이고, 현재 10,000원을 사용
            // ex) 기존 설정 값 (30,000) → 변경 값 (50,000)이고, 현재 20,000원을 사용
            queryArray = [data.budget, 0, campaignId];
          }
          const row = await doQuery(query, queryArray);
          if (row.result) {
            responseHelper.send([true], 'patch', res);
          }
        }
      }
    }),
  )
  .post(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId, marketerName } = responseHelper.getSessionData(req);
      const [
        campaignName,
        optionType,
        priorityType,
        priorityList,
        selectedTime,
        dailyLimit,
        startDate,
        finDate,
        keyword,
        bannerId,
        connectedLinkId,
        campaignDescription,
        merchandiseId,
      ] = responseHelper.getOptionalParam(
        [
          'campaignName',
          'optionType',
          'priorityType',
          'priorityList',
          'selectedTime',
          'dailyLimit',
          'startDate',
          'finDate',
          'keyword',
          'bannerId',
          'connectedLinkId',
          'campaignDescription',
          'merchandiseId',
        ],
        'POST',
        req,
      );

      console.log(
        'campaignId',
        campaignName,
        marketerId,
        bannerId,
        connectedLinkId,
        dailyLimit,
        priorityType,
        optionType,
        0,
        priorityList,
        marketerName,
        keyword,
        startDate,
        finDate,
        selectedTime,
        campaignDescription,
        merchandiseId,
      );

      const searchQuery = `
            SELECT campaignId
            FROM campaign 
            WHERE marketerId = ?  
            ORDER BY regiDate DESC
            LIMIT 1`;

      const saveQuery = `
            INSERT INTO campaign 
            (campaignId, campaignName, marketerId,
            bannerId, connectedLinkId, dailyLimit, priorityType, 
            optionType, onOff, targetList, marketerName, 
            keyword, startDate, finDate, selectedTime, campaignDescription, merchandiseId) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?)`;
      doQuery(searchQuery, [marketerId])
        .then(row => {
          const campaignId = dataProcessing.getCampaignId(row.result[0], marketerId);
          const targetJsonData = JSON.stringify({ targetList: priorityList });
          const timeJsonData = JSON.stringify({ time: selectedTime });
          const keywordsJsonData = JSON.stringify({ keywords: keyword });

          // 마케터 활동내역 로깅 테이블에서, 캠페인 생성의 상태값
          const MARKETER_ACTION_LOG_TYPE = 5;

          Promise.all<any>([
            doQuery(saveQuery, [
              campaignId,
              campaignName,
              marketerId,
              bannerId,
              connectedLinkId,
              dailyLimit,
              // @by hwasurr "1-1" 은 아프리카 카테고리 선택형. 1로 수정하여 카테고리 선택형으로 넣는다.
              priorityType === '1-1' ? '1' : priorityType,
              optionType,
              targetJsonData,
              marketerName,
              keywordsJsonData,
              new Date(startDate),
              finDate,
              timeJsonData,
              campaignDescription,
              merchandiseId || null,
            ]),
            dataProcessing.PriorityDoquery({
              campaignId,
              priorityType,
              priorityList,
              optionType,
              platform: priorityType === '1' ? 'twitch' : 'afreeca', // afreeca 카테고리 선택형 = 1-1
            }),
            dataProcessing.adpageDoQuery({
              campaignId,
              optionType,
              priorityType,
              priorityList,
            }),
          ])
            .then(() => {
              responseHelper.send([true, '캠페인이 생성되었습니다.'], 'POST', res);
              // 마케터 활동내역 테이블 적재.
              marketerActionLogging([
                marketerId,
                MARKETER_ACTION_LOG_TYPE,
                JSON.stringify({ campaignName }),
              ]);
              slack({
                summary: '캠페인 등록 알림',
                text: '관리자 페이지에서 방금 등록된 캠페인을 확인하세요.',
                fields: [
                  { title: '마케터 이름', value: marketerName!, short: true },
                  { title: '캠페인 이름', value: campaignName!, short: true },
                ],
              });
            })
            .catch(error => {
              responseHelper.promiseError(error, next);
            });
        })
        .catch(error => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .delete(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const campaignId = responseHelper.getParam('campaignId', 'DELETE', req);
      const query = `
            UPDATE campaign
            SET deletedState = 1 ,
            onOFF = 0
            WHERE campaignId = ?`;

      const selectQuery = `
            SELECT campaignName FROM campaign WHERE campaignId = ?`;
      doQuery(query, [campaignId])
        .then(() => {
          doQuery(selectQuery, [campaignId])
            .then(row => {
              responseHelper.send([true], 'DELETE', res);
              const { campaignName } = row.result[0];
              // marketer action log 테이블 적재
              const MARKETER_ACTION_LOG_TYPE = 12; // <캠페인 삭제> 상태값
              marketerActionLogging([
                marketerId,
                MARKETER_ACTION_LOG_TYPE,
                JSON.stringify({ campaignName }),
              ]);
            })
            .catch(error => {
              responseHelper.promiseError(error, next);
            });
        })
        .catch(error => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
