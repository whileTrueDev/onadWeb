import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = express.Router();

interface CampaignData {
  creatorId: string;
  state: number;
  campaignId: string;
  date: string;
  bannerSrc: string;
  connectedLinkId?: string;
  marketerName: string;
  bannerDescription?: string;
  links?: string;
  CPM?: number;
  CPC?: number;
}

interface CreatorCampaignList {
  campaignList: CampaignData[];
  banList: string[];
}

interface CampaignPerIncomeData { campaignId: string; type: 'CPM' | 'CPC'; cash: number }

router.route('/')
  // 배너 밴 기능
  .delete(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const campaignId = responseHelper.getParam('campaignId', 'delete', req);
      const banListSearchQuery = `
      SELECT banList 
      FROM creatorCampaign 
      WHERE creatorId = ?`;
      interface BanList { banList: string }

      const banListUpdateQuery = `
      UPDATE creatorCampaign 
      SET banList = ? 
      WHERE creatorId = ?`;

      const row = await doQuery<BanList[]>(banListSearchQuery, [creatorId]);
      if (row.result) {
        const banList = JSON.parse(row.result[0].banList);
        const newCampaignList = banList.campaignList.concat(campaignId);
        banList.campaignList = newCampaignList;

        const banListUpdate = await doQuery(
          banListUpdateQuery, [JSON.stringify(banList), creatorId]
        );

        if (banListUpdate.result.affectedRows > 0) {
          responseHelper.send([true, 'success'], 'delete', res);
        } else {
          responseHelper.promiseError(new Error('배너 삭제에 실패했습니다'), next);
        }
      }
      responseHelper.send(true, 'delete', res);
    })
  )
  .all(responseHelper.middleware.unusedMethod);

// 캠페인 ID array 를 통해 각 캠페인 ID에 따른 cash를 구하는 함수.
// banList에 존재할 때 state 또한 변경하는 함수.
const getIncomePerCampaign = async ({
  campaignList, banList
}: CreatorCampaignList): Promise<CampaignData[]> => {
  const cashQuery = `
  SELECT campaignId, type, sum(cashToCreator)  as cash
  FROM campaignLog
  WHERE campaignId = ?  AND creatorId = ?
  GROUP by campaignLog.type
  `;
  const newList: CampaignData[] = [];
  await Promise.all(
    campaignList.map((campaignData) => {
      const newCampaignData: any = { ...campaignData, CPC: 0, CPM: 0 };
      return doQuery(cashQuery, [campaignData.campaignId, campaignData.creatorId])
        .then((row) => {
          if (row.result) {
            if (banList.includes(newCampaignData.campaignId)) {
              newCampaignData.state = 0;
            }
            let cash = 0;
            row.result.forEach((cashData: CampaignPerIncomeData) => {
              newCampaignData[cashData.type] = cashData.cash;
              cash += cashData.cash;
            });
            newCampaignData.cash = cash;
            newList.push(newCampaignData);
            const newDate = new Date(newCampaignData.date);
            newDate.setHours(newDate.getHours() + 9);
            newCampaignData.date = newDate.toLocaleString('ko-KR', {
              timeZone: 'UTC',
              hour12: false,
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
  ).catch((errorData) => {
    console.log(errorData);
  });

  return newList;
};

router.route('/list')
  // 크리에이터 배너 목록 정보
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const listQuery = `
      SELECT
        CT.campaignId, CT.date, BR.bannerSrc, CT.creatorId, campaign.connectedLinkId,
        campaign.onOff as state, campaign.marketerName,  bannerDescription, IR.links
      FROM (
        SELECT creatorId, campaignId , min(date) as date 
        FROM campaignTimestamp
        WHERE creatorId = ?
        GROUP BY campaignId
      ) AS CT
      JOIN campaign 
        ON CT.campaignId = campaign.campaignId
      JOIN bannerRegistered AS BR
        ON campaign.bannerId = BR.bannerId
      LEFT JOIN linkRegistered AS IR
        ON connectedLinkId = IR.linkId
      ORDER BY date DESC
      `;
      const bannerQuery = `
      SELECT banList 
      FROM creatorCampaign
      WHERE creatorId = ?
      `;

      Promise.all([
        doQuery(listQuery, [creatorId]),
        doQuery(bannerQuery, [creatorId])
      ])
        .then(async ([row, ban]) => {
          const banList: string[] = JSON.parse(ban.result[0].banList).campaignList;
          const campaignList = await getIncomePerCampaign({ campaignList: row.result, banList });
          responseHelper.send(campaignList, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


router.route('/overlay')
  // 크리에이터 배너 오버레이 주소 조회
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const query = `
      SELECT advertiseUrl, creatorContractionAgreement
      FROM creatorInfo
      WHERE creatorId = ?
      `;

      doQuery(query, [creatorId])
        .then((row) => {
          const result = row.result[0];
          result.advertiseUrl = `https://banner.onad.io/banner${result.advertiseUrl}`;
          responseHelper.send(result, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/active')
  // 크리에이터 현재 송출중 배너
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const query = `
      SELECT mi.marketerName, br.bannerSrc, br.bannerDescription
      FROM campaign as cp

      JOIN bannerRegistered as br
      ON cp.bannerId = br.bannerId

      JOIN marketerInfo as mi
      ON cp.marketerId = mi.marketerId

      JOIN campaignTimestamp as ct
      ON  cp.campaignId = ct.campaignId
      
      WHERE cp.onOff = 1
      AND ct.creatorId = ?
      AND ct.date >= NOW() - INTERVAL 10 MINUTE
      ORDER BY ct.date DESC
      LIMIT 2
      `;

      doQuery(query, [creatorId])
        .then((row) => {
          const { result } = row;
          result.advertiseUrl = `https://banner.onad.io/banner${result.advertiseUrl}`;
          responseHelper.send(result, 'get', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
