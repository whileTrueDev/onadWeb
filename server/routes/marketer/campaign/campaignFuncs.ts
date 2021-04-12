import doQuery from '../../../model/doQuery';

export interface CampaignData {
  campaignId: string;
  campaignName: string;
  optionType: number;
  priorityType: number | string;
  regiDate: string;
  onOff: number;
  confirmState: number;
  bannerSrc: string;
  links: string;
  linkConfirmState: number;
  dailyLimit: number;
  selectedTime: string;
  targetList: string;
  startDate: string;
  finDate: string;
}

export interface CampaignDataWithCreators extends CampaignData {
  targetCreators?: {
    afreecaId?: string;
    afreecaName?: string;
    creatorName?: string;
    creatorTwitchId?: string;
  }[];
}


export const CAMPAIGN_QUERY_BASE = `
SELECT
  campaignId AS id, campaignId, campaignName, optionType, priorityType, 
  campaign.regiDate as regiDate, onOff, br.confirmState, 
  br.bannerId, br.bannerSrcUrl AS bannerSrc, br.regiDate AS bannerRegiDate,
  lr.linkId, lr.links as links, lr.confirmState as linkConfirmState, dailyLimit,
  campaignDescription, startDate, finDate, selectedTime, targetList, campaign.merchandiseId,
  mr.name AS merchandiseName, mr.stock AS merchandiseStock,
  mm.soldCount AS merchandiseSoldCount, mm.itemSiteUrl AS merchandiseItemSiteUrl,
  mm.uploadState AS merchandiseUploadState, mm.denialReason AS merchandiseDenialReason
FROM campaign
  JOIN bannerRegistered AS br ON br.bannerId = campaign.bannerId
  LEFT JOIN linkRegistered AS lr ON lr.linkId = connectedLinkId
  LEFT JOIN merchandiseRegistered AS mr ON mr.id = campaign.merchandiseId
  LEFT JOIN merchandiseMallItems AS mm ON campaign.merchandiseId = mm.merchandiseId
`;

/**
 * 기본 캠페인 정보에, 캠페인 별 금일 예산 사용량, 타겟 크리에이터 정보를  캠페인 정보를 가져와 추가합니다.
 * @param campaign 캠페인 데이터
 * @returns 일일예산 데이터와 타겟 크리에이터 정보가 추가된 캠페인
 */
export const getCampaignDetail = async (
  campaign: CampaignData
): Promise<CampaignDataWithCreators> => {
  // *******************************************************************
  // 캠페인 별 금일 예산 사용량 불러오기  +  타겟 크리에이터 정보 불러오기

  // 오늘자 일일예산에 대한 예산소비량을 체크하기 위해 오늘의 맨처음 시간으로 설정
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  const sumQuery = `
        SELECT sum(cashFromMarketer) AS dailysum
        FROM campaignLog WHERE campaignId = ? AND date > ?
      `;
  const responseResult = await doQuery(sumQuery, [campaign.campaignId, date])
    .then(async (inrow) => {
      const { dailysum } = inrow.result[0];
      const linkData = JSON.parse(campaign.links);
      const selectedTime = JSON.parse(campaign.selectedTime).time;
      const { targetList } = JSON.parse(campaign.targetList);

      // 캠페인 송출 우선순위가 크리에이터 우선인 경우 크리에이터 정보를 가져온다.
      if (campaign.priorityType === 0) {
        let targetCreatorInfoQuery = `
                  SELECT creatorId, creatorName, creatorTwitchId, creatorLogo, afreecaId, afreecaName, afreecaLogo
                  FROM creatorInfo WHERE creatorId IN
                `;
        targetList.forEach((creatorId: string, index: number) => {
          if (index === 0) targetCreatorInfoQuery += '(';
          targetCreatorInfoQuery += `"${creatorId}"`;
          if (index !== targetList.length - 1) targetCreatorInfoQuery += ',';
          else targetCreatorInfoQuery += ')';
        });

        const creatorInfos = await doQuery(targetCreatorInfoQuery);
        return {
          ...campaign,
          linkData,
          dailysum,
          selectedTime,
          targetList,
          targetCreators: creatorInfos.result,
        };
      }

      // 캠페인 송출 우선순위가 크리에이터 우선형이 아닌 경우에는 타겟 리스트 그대로 반환
      return {
        ...campaign,
        linkData,
        dailysum,
        selectedTime,
        targetList
      };
    });
  return responseResult;
};

/**
 * 캠페인 목록 정보를 가져옵니다.
 * @param param0 marketerId, searchPage, searchOffset
 * @returns 캠페인 정보 (일일예산, 타겟크리에이터 목록 포함)
 */
export const getCampaigns = async ({
  marketerId, searchPage, searchOffset
}: {
  marketerId: string; searchPage: number; searchOffset: number;
}): Promise<CampaignDataWithCreators[]> => {
  // *******************************************************************
  // 캠페인 목록 불러오기
  const query = `${CAMPAIGN_QUERY_BASE}
  WHERE campaign.marketerId = ? AND deletedState = 0
  ORDER BY campaign.onOff DESC, campaign.regiDate DESC
  LIMIT ?, ?`;
  const { result } = await doQuery(query, [marketerId, searchPage, searchOffset]);
  if ((result.length === 0)) return result;

  const responseResult = await Promise.all(
    result.map((cam: CampaignData) => getCampaignDetail(cam))
  ) as CampaignDataWithCreators[];

  return responseResult;
};

/**
 * 개별 캠페인 정보를 가져옵니다.
 * @param campaignId 캠페인 아이디
 * @returns 캠페인 정보 (일일예산, 타겟크리에이터 목록 포함)
 */
export const getCampaign = async (
  campaignId: string
): Promise<CampaignDataWithCreators | null> => {
  const query = `${CAMPAIGN_QUERY_BASE}
  WHERE campaignId = ? AND deletedState = 0
  ORDER BY campaign.onOff DESC, campaign.regiDate DESC`;

  const { result } = await doQuery(query, [campaignId]);
  if (result.length === 0) return null;

  return getCampaignDetail(result[0]);
};
