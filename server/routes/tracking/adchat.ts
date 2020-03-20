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
    interface SelectedRows {
      campaignName: string; linkId: string; links: string; creatorId: string;
    }
    interface Link { primary?: boolean; linkName: string; linkTo: string }

    const nowIp: string | string[] | undefined = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const [campaignId, referrer, userAgent] = responseHelper.getParam(['campaignId', 'referrer', 'userAgent'], 'post', req);
    console.log('referrer: ', referrer);
    console.log(referrer.split('twitch.tv/'));

    // User agent parsing
    const UA = new uaparser.UAParser(userAgent);
    const uaDevice = UA.getDevice();
    const OS = UA.getOS();
    const browser = UA.getBrowser();
    const browserEngine = UA.getEngine();
    const device = `${uaDevice.vendor},${uaDevice.model},${uaDevice.type}`; // null 처리 필요

    // Get creatorId
    const creatorTwitchId = referrer.split('twitch.tv/')[1];

    // 클릭로그 적재에 필요한 데이터 가져오기
    const selectQuery = `
    SELECT campaignName, linkId, links, creatorId
      FROM campaign
      JOIN linkRegistered ON linkId = connectedLinkId
      RIGHT JOIN creatorInfo ON creatorTwitchId = ?
    WHERE campaignId = ?`;
    const selectArray = [creatorTwitchId, campaignId];

    const selectedRows = await doQuery<SelectedRows[]>(selectQuery, selectArray);
    if (selectedRows.result.length > 0) {
      // 링크URL
      const links: Link[] = JSON.parse(selectedRows.result[0].links);
      // 적재를 위한 데이터
      const { campaignName, linkId, creatorId } = selectedRows.result[0];
      // CPC
      const payout = 500; // calculator > landingCalculator_v1 > GAUGE
      const whereToGo = links.find((link) => link.primary)?.linkTo;

      // 중복 클릭 체크
      const alreadyInsertedCheckQuery = `
      SELECT id FROM tracking
        WHERE creatorId = ?
        AND campaignId = ? AND linkId = ? AND ip = ?
        AND clickedTime > DATE_SUB(now(), INTERVAL 7 DAY)`;
      const alreadyInsertedCheckArray = [creatorId, campaignId, linkId, nowIp];
      const alreadyInserted = await doQuery<{id: number}[]>(
        alreadyInsertedCheckQuery, alreadyInsertedCheckArray
      );
      if (alreadyInserted.result) { // 중복클릭인 경우 데이터 적재 X, 단순 리디렉팅만
        const result = { message: 'already inserted', href: whereToGo };
        responseHelper.send(result, 'post', res);
      } else { // 중복클릭이 아닌 경우
        const insertQuery = `
        INSERT INTO tracking (
            action, conversionTime, linkId, campaignId, campaignName, marketerId,
            creatorId, creatorTwitchId, ip, device, os, os_version,
            browser, browser_version, browser_engine, browser_engine_version, payout
          ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
        const queryArray = [
          'CPC', null, linkId, campaignId, campaignName, campaignId.split('_')[0],
          creatorId, creatorTwitchId, nowIp, device, OS.name, OS.version,
          browser.name, browser.version, browserEngine.name, browserEngine.version,
          payout
        ];

        const insertRows = await doQuery(insertQuery, queryArray);
        if (insertRows.result) {
          if (insertRows.result.affectedRows > 0) {
            // 해당 캠페인의 링크 중 primary 링크로 보낸다.
            const result = { message: 'success', href: whereToGo };
            responseHelper.send(result, 'post', res);
          }
        }
      }
    }
  }))
  .all(responseHelper.middleware.unusedMethod);

export default router;
