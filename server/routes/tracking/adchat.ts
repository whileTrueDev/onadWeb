import express from 'express';
import uaparser from 'ua-parser-js';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery';

const router = express.Router();

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
router.route('/')
  .post(responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const NowIp: string | string[] | undefined = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const [campaignId, referrer, userAgent] = responseHelper.getParam(['campaignId', 'referrer', 'userAgent'], 'post', req);
    console.log('referrer: ', referrer);
    console.log(referrer.split('twitch.tv/'));

    const creatorTwitchId = referrer.split('twitch.tv/')[1];
    const UA = new uaparser.UAParser(userAgent);
    const uaDevice = UA.getDevice();
    const device = `${uaDevice.vendor},${uaDevice.model},${uaDevice.type}`; // null 처리 필요
    const browser = UA.getBrowser();
    const OS = UA.getOS();
    const browserEngine = UA.getEngine();

    const selectQuery = `
    SELECT campaignName, linkId, links, creatorId
      FROM campaign
      JOIN linkRegistered ON linkId = connectedLinkId
      RIGHT JOIN creatorInfo ON creatorTwitchId = ?
    WHERE campaignId = ?
    `;
    const selectArray = [creatorTwitchId, campaignId];

    const insertQuery = `
    INSERT INTO tracking (
      action, conversionTime, linkId, campaignId, campaignName, marketerId,
      creatorId, creatorTwitchId, ip, device, os, os_version,
      browser, browser_version, browser_engine, browser_engine_version, payout
    ) VALUES (
      ?, ?, ?, ?, ?, ?, 
      ?, ?, ?, ?, ?, ?, 
      ?, ?, ?, ?
    )`;
    const queryArray = [
      'CPC', null, linkId, campaignId, campaignName, campaignId.split('_')[0],
      creatorId, creatorTwitchId, NowIp, device, OS.name, OS.version,
      browser.name, browser.version, browserEngine.name, browserEngine.version,
      payout
    ];

    // const row = await doQuery(query, [campaignId]);


    const result = {
      message: 'success',
      href: 'https://youtube.com'
    };
    responseHelper.send(result, 'post', res);
  }))
  .all(responseHelper.middleware.unusedMethod);

export default router;
