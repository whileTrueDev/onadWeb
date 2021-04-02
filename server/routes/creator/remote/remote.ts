import { Router } from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = Router();

async function getRemotePageBanner(campaignList: any, pausedList: string[]): Promise<any[]> {
  return Promise.all(
    campaignList.map((campaignData: any) => {
      if (pausedList.includes(campaignData.campaignId)) {
        return { ...campaignData, state: 0 };
      }
      return campaignData;
    })
  );
}

router.route('/page-url')
  .get(responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const searchQuery = `
        SELECT remoteControllerUrl
        FROM creatorInfo
        WHERE creatorId = ?
      `;
      doQuery(searchQuery, [creatorId])
        .then((row) => {
          responseHelper.send(row.result[0].remoteControllerUrl, 'get', res);
        })
        .catch((errorData) => {
          throw new Error(`Error in /creators - ${errorData}`);
        });
    }))
  .all(responseHelper.middleware.unusedMethod);

router.route('/campaigns')
// 크리에이터 배너 목록 정보
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const urlInfo = responseHelper.getParam('remoteControllerUrl', 'get', req);
      const getCreatorIdQuery = `
          SELECT creatorId 
          FROM creatorInfo 
          WHERE remoteControllerUrl = ?
      `;
      const listQuery = `
      SELECT
        campaign.campaignId, campaign.marketerName, priorityType, targetList, CT.date, campaign.onOff as state,
        campaign.campaignDescription,
        MR.id AS merchandiseId, MR.name AS merchandiseName, MR.price AS merchandisePrce,
        BR.bannerSrc
      FROM (
        SELECT creatorId, campaignId , min(date) as date 
        FROM campaignTimestamp
        WHERE creatorId = "130096343"
        GROUP BY campaignId
      ) AS CT
      JOIN campaign ON CT.campaignId = campaign.campaignId
      JOIN bannerRegistered AS BR ON campaign.bannerId = BR.bannerId
      LEFT JOIN linkRegistered AS IR ON connectedLinkId = IR.linkId
      LEFT JOIN merchandiseRegistered AS MR ON MR.id = campaign.merchandiseId
      WHERE campaign.onOff = 1
      ORDER BY date DESC
                          `;
      const getPausedQuery = `
          SELECT pausedList 
          FROM creatorCampaign
          WHERE creatorId = ?
          `;
      const searchQuery = `
          SELECT creatorName, afreecaName
          FROM creatorInfo
          WHERE creatorId = ?
          `;
      const creatorId = await doQuery(getCreatorIdQuery, [!urlInfo.startsWith('/') ? `/${urlInfo}` : urlInfo]);
      Promise.all([
        doQuery(searchQuery, [creatorId.result[0].creatorId]),
        doQuery(listQuery, [creatorId.result[0].creatorId]),
        doQuery(getPausedQuery, [creatorId.result[0].creatorId])
      ])
        .then(async ([creatorName, row, paused]) => {
          const pausedList: string[] = JSON.parse(paused.result[0].pausedList).campaignList;
          const campaignList = await getRemotePageBanner(row.result, pausedList);
          const result = campaignList.map((value: any): void => ({
            ...value,
            targetList: JSON.parse(value.targetList).targetList,
            creatorName: creatorName.result[0].creatorName || creatorName.result[0].afreecaName
          }));
          responseHelper.send(result, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    })

  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/onoff')
  .patch(
  // 토글 버튼 변화에 따른 pausedList 업데이트
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const onOffDetail: (string|number)[] = responseHelper.getParam(['campaignId', 'state', 'url'], 'PATCH', req);
      const campaignId = onOffDetail[0];
      const state = onOffDetail[1];
      const pageUrl = onOffDetail[2];
      const getCreatorIdQuery = `
                                SELECT creatorId
                                FROM creatorInfo
                                WHERE remoteControllerUrl = ?
                                `;

      const getPausedListQuery = `
                                SELECT pausedList 
                                FROM creatorCampaign 
                                WHERE creatorId = ?`;
      const banListUpdateQuery = `
                                UPDATE creatorCampaign 
                                SET pausedList = ? 
                                WHERE creatorId = ?
                                `;
      const creatorId = await doQuery(getCreatorIdQuery, [`/${pageUrl}`])
        .then((value) => value.result[0].creatorId);
      const row = await doQuery(getPausedListQuery, [creatorId]);

      if (row.result) {
        const pausedList = JSON.parse(row.result[0].pausedList);
        if (state === 1) { // off -> on 인 경우
          const newCampaignList = pausedList.campaignList.concat(campaignId);
          pausedList.campaignList = newCampaignList;
        } else { // off -> on 인 경우
          pausedList.campaignList.splice(pausedList.campaignList.indexOf(campaignId), 1);
        }

        const pausedListUpdate = await doQuery(
          banListUpdateQuery, [JSON.stringify(pausedList), creatorId]
        );

        if (pausedListUpdate.result.affectedRows > 0) {
          responseHelper.send([true, 'success'], 'patch', res);
        } else {
          responseHelper.promiseError(new Error('배너 상태 변경에 실패했습니다'), next);
        }
      }
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
