import uaparser from 'ua-parser-js';
import doQuery from '../../models/doQuery';
/**
clickedTime: 클릭 시간
conversionTime: 전환 시간
action: 클릭/전환 상태
linkId: 링크의 아이디
campaignId: 해당 캠페인 아이디
campaignName: 해당 캠페인 아이디
marketerId: 해당 캠페인의 마케터 아이디
creatorId: 클릭의 출처
creatorTwitchId: 클릭의 출처 (트위치아이디)
ip: 접속자 IP
device: 접속자 기기
os: 접속자 OS
os_version: 접속자 OS버전
browser: 접속자 브라우저
browser_version: 접속자 브라우저 버전
browser_engine: 접속자 브라우저 엔진
payout: 금액
*/
interface UserData {
  userAgent: string;
}

async function adChat(req: Express.Request, res: Express.Response, userData: UserData, urlInfo: string[]): Promise<string | undefined> {
  interface SelectedRows {
    campaignName: string; linkId: string; links: string; creatorId: string;
  }
  interface GetLink { primary?: boolean; linkName: string; linkTo: string }

  const nowIp: string | string[] | undefined = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // 봇, 아이피 차단
  const banIpArray = ['66.249.64.79'];

  if (Object.keys(userData).length === 0) { return; }

  if (typeof nowIp === 'string' && banIpArray.includes(nowIp)) {
    console.log(`[${new Date().toLocaleString()}] AdChat - banned IP - ${nowIp}`);
  } else {
    // Get data
    // User agent parsing
    const urlCreatorId = urlInfo[0];
    const creatorTwitchId: string = urlCreatorId;
    const { userAgent } = userData;
    let campaignId = '';
    const UA = new uaparser.UAParser(userAgent);
    const uaDevice = UA.getDevice();
    const OS = UA.getOS();
    const browser = UA.getBrowser();
    const browserEngine = UA.getEngine();
    const device = `${uaDevice.vendor},${uaDevice.model},${uaDevice.type}`; // null 처리 필요

    const getCreatorIdQuery = `
      SELECT creatorId FROM creatorInfo WHERE creatorTwitchId = ?
    `;

    const getCampaignIdQuery = `
      SELECT campaignId, date 
      FROM campaignTimestamp 
      WHERE creatorId = ? 
      ORDER BY DATE desc 
      LIMIT 1
    `;

    const getUrlIdQuery = `
      SELECT connectedLinkId 
      FROM campaign 
      WHERE campaignId = (SELECT campaignId FROM campaignTimestamp WHERE creatorId = ? ORDER BY DATE DESC LIMIT 1)
      AND optionType = 1;
      `;

    const getLinkQuery = `
      SELECT links 
      FROM linkRegistered 
      WHERE linkId = ?
    `;

    const getCreatorId = await doQuery(getCreatorIdQuery, [urlCreatorId]) // creatorId
      .then((row) => (row.result[0].creatorId));

    const getCampaignId = await doQuery(getCampaignIdQuery, [getCreatorId]) // campaignId
      .then((row) => (row.result[0].campaignId));
    campaignId = getCampaignId;
    const getLinkId = await doQuery(getUrlIdQuery, [getCreatorId]) // linkId
      .then((row) => (row.result[0].connectedLinkId));

    const { links }: { links: GetLink[] } = await doQuery(getLinkQuery, [getLinkId]) // link
      .then((row) => (JSON.parse(row.result[0].links)));

    const toLink = links.find((link) => link.primary) as GetLink;

    // 클릭로그 적재에 필요한 데이터 가져오기
    const selectQuery = `
      SELECT campaignName, linkId, links, creatorId
        FROM campaign
        JOIN linkRegistered ON linkId = connectedLinkId
        RIGHT JOIN creatorInfo ON creatorTwitchId = ?
      WHERE campaignId = ?
        AND campaign.optionType = 1`; // cpm+cpc

    // Get creatorId
    const selectedRows = await doQuery<SelectedRows[]>(
      selectQuery, [creatorTwitchId, campaignId]
    ); // 캠페인아이디가 올바른 것인지 확인 + 데이터 가져오기
    if (selectedRows.result.length > 0) {
      // 올바른 데이터인 경우.

      // 링크URL
      // 적재를 위한 데이터
      const { campaignName, linkId, creatorId } = selectedRows.result[0];
      // CPC
      // 테스트기간동안 0!!
      const payout = 0; // calculator > landingCalculator_v1 > GAUGE
      const whereToGo = toLink.linkTo;

      if (!whereToGo) {
        console.log(`[${new Date().toLocaleString()}] AdChat - No primary link - ${creatorTwitchId}, ${campaignId}`);
      } else {
        // 중복 클릭 체크
        const alreadyInsertedCheckQuery = `
          SELECT id FROM tracking
            WHERE creatorId = ?
            AND campaignId = ? AND linkId = ? AND ip = ?
            AND clickedTime > DATE_SUB(now(), INTERVAL 7 DAY)`;
        const alreadyInsertedCheckArray = [creatorId, campaignId, linkId, nowIp];
        const alreadyInserted = await doQuery<{ id: number }[]>(
          alreadyInsertedCheckQuery, alreadyInsertedCheckArray
        );
        let message = '';
        if (alreadyInserted.result.length === 0) { // 중복클릭이 아닌 경우
          message = 'success';
          const insertQuery = `
            INSERT INTO tracking (
                costType, conversionTime, linkId, campaignId, campaignName, marketerId,
                creatorId, creatorTwitchId, ip, device, os, os_version,
                browser, browser_version, browser_engine, browser_engine_version, payout, channel
              ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
          const queryArray = [
            'CPC', null, linkId, campaignId, campaignName, campaignId.split('_')[0],
            creatorId, creatorTwitchId, nowIp, device, OS.name, OS.version,
            browser.name, browser.version, browserEngine.name, browserEngine.version,
            payout, urlInfo[1]
          ];
          await doQuery(insertQuery, queryArray);
        }
        message = 'already inserted';
        const result = { message, href: whereToGo };
        return (whereToGo);
      }
    } else {
      console.log(`[${new Date().toLocaleString()}] invalid creatorTwitchId/campaignId - ${creatorTwitchId}, ${campaignId}`);
    }
  }
}


export default adChat;
