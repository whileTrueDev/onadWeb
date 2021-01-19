import UserAgent from '../@types/UserAgent';
import TrackingMessage from '../@types/TrackingMessage';
import trackingLogging from './trackingLogging';
import doQuery from '../models/doQuery';
import createInformationQuery from './queries/createInformationQuery';
import createTrackingInsertQuery from './queries/createTrackingInsertQuery';
import createDuplicateCheckQuery from './queries/createDuplicateCheckQuery';
import createLevelUpQuery from './queries/createLevelUpQuery';

interface NowBroadData {
  campaignId: string; campaignName: string; creatorId: string;
  marketerId: string; date: string; creatorName: string;
  connectedLinkId: string; links: string;
}

interface Link { primary?: boolean; linkName: string; linkTo: string }

export default async function tracking(
  nowIp: string | string[] | undefined,
  userAgent: UserAgent,
  creatorPlatformId: string,
  channelType: 'adpanel' | 'adchat',
  broadPlatform: 'twitch' | 'afreeca' = 'twitch',
): Promise<{ message: TrackingMessage; href?: string; name?: string }> {
  // 봇, 아이피 차단
  const banIpArray = ['66.249.64.79'];
  let message: TrackingMessage;

  // ******************************
  // ********** IP Check **********
  if (typeof nowIp === 'string' && banIpArray.includes(nowIp)) {
    trackingLogging(channelType, creatorPlatformId, `banned IP - ${nowIp}`);
    message = 'Invalid ip';
    return { message };
  }

  // ***************************************
  // ********** Get campaign data **********
  const [informationQuery, informationQueryArray] = createInformationQuery(
    broadPlatform, creatorPlatformId
  );
  const { result, error } = await doQuery<NowBroadData[]>(informationQuery, informationQueryArray);
  // DB ERROR
  if (error) {
    trackingLogging(channelType, creatorPlatformId, `DB Error - ${error}`);
    message = 'DB Error';
    return { message };
  }
  // There is no campaign
  if (result.length <= 0) {
    trackingLogging(channelType, creatorPlatformId, 'No Campaign');
    message = 'No campaign';
    return { message };
  }
  // ******************************
  // when campaign is valid
  const {
    campaignId, creatorId, connectedLinkId, links, campaignName, creatorName, marketerId
  } = result[0];

  // CPC 요금
  const payout = process.env.CPC_PAYOUT || 100; // calculator > landingCalculator_v1 > GAUGE
  // CPC 링크
  const linksObject = JSON.parse(links).links as Link[];
  const whereToGo = linksObject.find((link) => link.primary)?.linkTo;

  if (whereToGo) {
    // 중복 클릭 체크
    const [alreadyInsertedCheckQuery, alreadyInsertedCheckArray] = createDuplicateCheckQuery({
      creatorId,
      campaignId,
      connectedLinkId,
      nowIp
    });
    const alreadyInserted = await doQuery<{ id: number }[]>(
      alreadyInsertedCheckQuery, alreadyInsertedCheckArray
    );
    if (alreadyInserted.result.length === 0) { // 중복클릭이 아닌 경우
      const [insertQuery, queryArray] = createTrackingInsertQuery(broadPlatform, {
        costType: 'CPC',
        conversinoTime: null,
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
      });
      await doQuery(insertQuery, queryArray);
      message = 'Successfully Inserted';
      trackingLogging(channelType, creatorPlatformId, message);

      // creatorRoyaltyLevel -> exp up
      const [levelQuery, levelQueryArray] = createLevelUpQuery(creatorId);
      await doQuery(levelQuery, levelQueryArray);
      trackingLogging(channelType, creatorPlatformId, 'Successfully Royalty level Updated');

      return { message, name: creatorName, href: whereToGo };
    }
    message = 'already inserted';
    trackingLogging(channelType, creatorPlatformId, message);
    const targetResult = { message, name: creatorName, href: whereToGo };
    return targetResult;
  }
  // Invalid Link
  message = 'invalid link';
  trackingLogging(channelType, creatorPlatformId, `error - ${message}`);
  return { message, name: creatorName };
}
