import UserAgent from '../@types/UserAgent';
import TrackingMessage from '../@types/TrackingMessage';
import trackingLogging from './trackingLogging';
import doQuery from '../models/doQuery';

interface NowBroadData {
  campaignId: string; campaignName: string; creatorId: string;
  marketerId: string; date: string; creatorName: string;
  connectedLinkId: string; links: string;
}

interface Link { primary?: boolean; linkName: string; linkTo: string }

export default async function tracking(
  nowIp: string | string[] | undefined,
  userAgent: UserAgent,
  creatorTwitchId: string,
  channelType: 'adpanel' | 'adchat'
): Promise<{message: TrackingMessage; href?: string; name?: string }> {
  // 봇, 아이피 차단
  const banIpArray = ['66.249.64.79'];
  let message: TrackingMessage;

  // ********** IP Check **********
  if (typeof nowIp === 'string' && banIpArray.includes(nowIp)) {
    trackingLogging(channelType, creatorTwitchId, `banned IP - ${nowIp}`);
    message = 'Invalid ip';
    return { message };
  }

  // ********** Get campaign data **********
  const getInformationQuery = `
    SELECT
      campaign.campaignId, campaign.campaignName, creatorInfo.creatorId, campaign.marketerId,
      campaignTimestamp.date, connectedLinkId, links, creatorName FROM campaignTimestamp
      JOIN creatorInfo ON creatorTwitchId = ?
      JOIN campaign ON campaign.campaignId = campaignTimestamp.campaignId
      JOIN linkRegistered ON linkRegistered.linkId = connectedLinkId
    WHERE campaignTimestamp.creatorId = creatorInfo.creatorId
      AND campaignTimestamp.date > date_sub(NOW(), INTERVAL 10 MINUTE)`;
  const { result, error } = await doQuery<NowBroadData[]>(getInformationQuery, [creatorTwitchId]);
  // DB ERROR
  if (error) {
    trackingLogging(channelType, creatorTwitchId, `DB Error - ${error}`);
    message = 'DB Error';
    return { message };
  }
  // There is no campaign
  if (result.length <= 0) {
    trackingLogging(channelType, creatorTwitchId, 'No Campaign');
    message = 'No campaign';
    return { message };
  }

  // when campaign is valid
  const {
    campaignId, creatorId, connectedLinkId, links, campaignName, creatorName, marketerId
  } = result[0];

  // CPC 요금
  const payout = process.env.CPC_PAYOUT || 100; // calculator > landingCalculator_v1 > GAUGE
  const linksObject = JSON.parse(links).links as Link[];
  const whereToGo = linksObject.find((link) => link.primary)?.linkTo;

  if (whereToGo) { // redirect
    // 중복 클릭 체크
    const alreadyInsertedCheckQuery = `
      SELECT id FROM tracking
        WHERE creatorId = ?
        AND campaignId = ? AND linkId = ? AND ip = ?
        AND clickedTime > DATE_SUB(now(), INTERVAL 7 DAY)`;
    const alreadyInsertedCheckArray = [creatorId, campaignId, connectedLinkId, nowIp];
    const alreadyInserted = await doQuery<{ id: number }[]>(
      alreadyInsertedCheckQuery, alreadyInsertedCheckArray
    );
    if (alreadyInserted.result.length === 0) { // 중복클릭이 아닌 경우
      const insertQuery = `
        INSERT INTO tracking (
            costType, conversionTime, linkId, campaignId, campaignName, marketerId,
            creatorId, creatorTwitchId, ip, device, os, os_version,
            browser, browser_version, browser_engine, browser_engine_version, payout, channel
          ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
      const queryArray = [
        'CPC', null, connectedLinkId, campaignId, campaignName, marketerId,
        creatorId, creatorTwitchId, nowIp,
        userAgent.device, userAgent.osName, userAgent.osVersion,
        userAgent.browserName, userAgent.browserVersion,
        userAgent.browserEngineName, userAgent.browserEngineVersion,
        payout, channelType
      ];
      await doQuery(insertQuery, queryArray);
      message = 'Successfully Inserted';
      trackingLogging(channelType, creatorTwitchId, message);

      // creatorRoyaltyLevel -> exp up
      const levelQuery = `
      UPDATE creatorRoyaltyLevel
        SET exp = exp + 1
        WHERE creatorId = ?`;
      const levelQueryArray = [creatorId];
      await doQuery(levelQuery, levelQueryArray);
      trackingLogging(channelType, creatorTwitchId, 'Successfully Royalty level Updated');

      return { message, name: creatorName, href: whereToGo };
    }
    message = 'already inserted';
    trackingLogging(channelType, creatorTwitchId, message);
    const targetResult = { message, name: creatorName, href: whereToGo };
    return targetResult;
  }
  // Invalid Link
  message = 'invalid link';
  trackingLogging(channelType, creatorTwitchId, `error - ${message}`);
  return { message, name: creatorName };
}
