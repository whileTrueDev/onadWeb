import doQuery, { OkPacket } from './doQuery'; // For data insert
import createChatInsertQueryValues from '../lib/createChatInsertQueryValues'; // For Query
import { Chat } from '../chat/twitch/chat.type';

export interface ContractedCreatorsResult {
  creatorTwitchId: string;
  adChatAgreement: number;
}

export interface Link {
  primary: boolean;
  linkName: string;
  linkTo: string;
}
export interface CampaignQueryResult {
  campaignId: string;
  campaignName: string;
  marketerName: string;
  linkId: string; // connectedLinkId
  linkstring: string;
}

export interface Campaign extends CampaignQueryResult {
  links: Link[];
}

// 계약된 모든 크리에이터 가져오기.
function getContratedCreators(): Promise<ContractedCreatorsResult[]> {
  const getContractedChannelsQuery = `
  SELECT creatorTwitchId, adChatAgreement
    FROM creatorInfo
    WHERE creatorContractionAgreement = 1`;
  return doQuery<ContractedCreatorsResult[]>(getContractedChannelsQuery)
    .then((row) => {
      if (row.error || !row.result) {
        console.log('[DB적재 에러]');
      }
      return row.result;
    })
    .catch((err) => {
      console.log('err', err);
      throw Error(err);
    });
}

// 채팅로그 버퍼에 쌓인 모든 채팅로그를 적재.
function insertChats(chatBuffer: Chat[]): Promise<OkPacket> {
  const [insertQuery, insertQueryArray] = createChatInsertQueryValues(chatBuffer);

  // Reqeust query to DB
  return doQuery<OkPacket>(insertQuery, insertQueryArray)
    .then((row) => {
      if (row.error || !row.result) {
        console.log('[DB적재 에러]');
      } else {
        console.log(`[Insert Success] - number of row: ${chatBuffer.length}`);
      }
      return row.result;
    })
    .catch((err) => {
      console.log('err', err);
      throw Error(err);
    });
}

// 모든 ON 상태인 캠페인 가져오기
async function getActiveCampaigns(): Promise<Campaign[]> {
  const query = `
  SELECT campaign.campaignId, campaignName, marketerName, linkId, links as linkstring
    FROM campaign
  JOIN linkRegistered AS lr
    ON campaign.connectedLinkId = lr.linkId
  WHERE campaign.onOff = 1
  `;
  const row = await doQuery<CampaignQueryResult[]>(query);
  if (row.error) {
    throw Error(`getActiveCampaigns Error - ${row.error}`);
  }
  const result = row.result.map((camp) => ({ ...camp, links: JSON.parse(camp.linkstring).links }));
  return result;
}

export default {
  getContratedCreators,
  insertChats,
  getActiveCampaigns,
};
