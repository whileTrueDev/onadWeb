
export interface TrackingInsertParams {
    costType: 'CPC' | 'CPA' | 'CPS';
    conversinoTime: Date | null;
    connectedLinkId: string | null;
    campaignId: string;
    campaignName: string;
    marketerId: string;
    creatorId: string;
    creatorPlatformId: string;
    nowIp?: string | string[];
    userAgent: {
      device: string;
      osName?: string;
      osVersion?: string;
      browserName?: string;
      browserVersion?: string;
      browserEngineName?: string;
      browserEngineVersion?: string;
    };
    payout: string | number;
    channelType: string;
}
/**
 * 광고 클릭 tracking 정보를 삽입하기 위한 쿼리와 쿼리파라미터 배열을 반환하는 함수.
 * @param broadPlatform 클릭이 시작된 방송 플랫폼. twitch | afreeca 중 하나.
 * @param params tracking 정보 파라미터
 */
export default function createTrackingInsertQuery(
  broadPlatform: 'twitch' | 'afreeca',
  params: TrackingInsertParams
): [string, Array<any>] {
  const {
    costType = 'CPC',
    conversinoTime = null,
    connectedLinkId,
    campaignId,
    campaignName,
    marketerId,
    creatorId,
    creatorPlatformId,
    nowIp,
    userAgent,
    payout,
    channelType,
  } = params;

  let insertQuery = '';
  if (broadPlatform === 'afreeca') {
    // creatorAfreecaId 추가
    insertQuery = `
    INSERT INTO tracking (
      costType, conversionTime, linkId, campaignId, campaignName, marketerId,
      creatorId, creatorAfreecaId, ip, device, os, os_version,
      browser, browser_version, browser_engine, browser_engine_version, payout, channel
    ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )
    `;
  } else {
    insertQuery = `
    INSERT INTO tracking (
        costType, conversionTime, linkId, campaignId, campaignName, marketerId,
        creatorId, creatorTwitchId, ip, device, os, os_version,
        browser, browser_version, browser_engine, browser_engine_version, payout, channel
      ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
  }

  const queryArray = [
    costType, conversinoTime, connectedLinkId, campaignId, campaignName, marketerId,
    creatorId, creatorPlatformId, nowIp,
    userAgent.device, userAgent.osName, userAgent.osVersion,
    userAgent.browserName, userAgent.browserVersion,
    userAgent.browserEngineName, userAgent.browserEngineVersion,
    payout, channelType
  ];

  return [insertQuery, queryArray];
}
