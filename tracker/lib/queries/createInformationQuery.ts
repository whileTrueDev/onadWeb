/**
 * 특정 유저의 유저 정보와 현재 진행중인 광고 정보를 찾아오는 쿼리를 생성하는 함수.
 * (10분 이내에 방송한 기록이 있으며, 10분 이내에 배너+클릭광고를 송출하고 있는 크리에이터 )
 * @param broadPlatform 클릭이 시작된 방송 플랫폼. twitch | afreeca 중 하나.
 * @param platformId 해당 플랫폼의 유저 ID (ex. 철구-아프리카 : y1026, 풍월량-트위치: hanryang1125 )
 */
export default function createInformationQuery(
  broadPlatform: 'twitch' | 'afreeca', platformId: string,
): [string, string[]] {
  if (broadPlatform === 'afreeca') {
    const getInformationQuery = `
    SELECT
      campaign.optionType, campaign.campaignId, campaign.campaignName, creatorInfo.creatorId, campaign.marketerId,
        campaignTimestamp.date, connectedLinkId, links, creatorName, campaign.merchandiseId, itemSiteUrl
      FROM campaignTimestamp
        JOIN creatorInfo ON afreecaId = ?
        JOIN campaign ON campaign.campaignId = campaignTimestamp.campaignId
        LEFT JOIN linkRegistered ON linkRegistered.linkId = connectedLinkId
        LEFT JOIN merchandiseMallItems ON campaign.merchandiseId = merchandiseMallItems.merchandiseId
        JOIN AfreecaBroad ON creatorInfo.afreecaId = AfreecaBroad.userId
        JOIN AfreecaBroadDetail on AfreecaBroad.broadId = AfreecaBroadDetail.broadId
      WHERE campaignTimestamp.creatorId = creatorInfo.creatorId
        AND campaignTimestamp.date > date_sub(NOW(), INTERVAL 10 MINUTE)
        AND AfreecaBroadDetail.createdAt > date_sub(NOW(), INTERVAL 10 MINUTE)
      ORDER BY campaignTimestamp.date desc LIMIT 1`;
    const getInformationQueryArray = [platformId];
    return [getInformationQuery, getInformationQueryArray];
  }

  const getInformationQuery = `
      SELECT
      campaign.optionType, campaign.campaignId, campaign.campaignName, creatorInfo.creatorId, campaign.marketerId,
        campaignTimestamp.date, connectedLinkId, links, creatorName, campaign.merchandiseId, itemSiteUrl
      FROM campaignTimestamp
        JOIN creatorInfo ON creatorTwitchId = ?
        JOIN campaign ON campaign.campaignId = campaignTimestamp.campaignId
        LEFT JOIN linkRegistered ON linkRegistered.linkId = connectedLinkId
        LEFT JOIN merchandiseMallItems ON campaign.merchandiseId = merchandiseMallItems.merchandiseId
        JOIN twitchStreamDetail ON creatorInfo.creatorName = twitchStreamDetail.streamerName
      WHERE campaignTimestamp.creatorId = creatorInfo.creatorId
        AND campaignTimestamp.date > date_sub(NOW(), INTERVAL 10 MINUTE)
        AND twitchStreamDetail.time > date_sub(NOW(), INTERVAL 10 MINUTE)
      ORDER BY campaignTimestamp.date desc LIMIT 1`;
  const getInformationQueryArray = [platformId];
  return [getInformationQuery, getInformationQueryArray];
}
