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
    // 봇, 아이피 차단
    const banIpArray = ['66.249.64.79'];
    if (typeof nowIp === 'string' && banIpArray.includes(nowIp)) {
      console.log(`[${new Date().toLocaleString()}] AdChat - banned IP - ${nowIp}`);
      responseHelper.promiseError(Error('Invalid Ip'), next);
    } else {
      // Get data
      const [creatorTwitchId, campaignId, referrer, userAgent]: string[] = responseHelper.getParam(
        ['creatorTwitchId', 'campaignId', 'referrer', 'userAgent'], 'post', req
      );
      console.log('referrer: ', referrer);

      // User agent parsing
      const UA = new uaparser.UAParser(userAgent);
      const uaDevice = UA.getDevice();
      const OS = UA.getOS();
      const browser = UA.getBrowser();
      const browserEngine = UA.getEngine();
      const device = `${uaDevice.vendor},${uaDevice.model},${uaDevice.type}`; // null 처리 필요

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
        const { links }: { links: Link[] } = JSON.parse(selectedRows.result[0].links);
        // 적재를 위한 데이터
        const { campaignName, linkId, creatorId } = selectedRows.result[0];
        // CPC
        // 테스트기간동안 0!!
        const payout = 0; // calculator > landingCalculator_v1 > GAUGE
        const primaryLink = links.find((link) => link.primary) as Link;
        const whereToGo = primaryLink.linkTo;

        if (!whereToGo) {
          console.log(`[${new Date().toLocaleString()}] AdChat - No primary link - ${creatorTwitchId}, ${campaignId}`);
          responseHelper.promiseError(Error('No Link'), next);
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
                action, conversionTime, linkId, campaignId, campaignName, marketerId,
                creatorId, creatorTwitchId, ip, device, os, os_version,
                browser, browser_version, browser_engine, browser_engine_version, payout
              ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
            const queryArray = [
              'CPC', null, linkId, campaignId, campaignName, campaignId.split('_')[0],
              creatorId, creatorTwitchId, nowIp, device, OS.name, OS.version,
              browser.name, browser.version, browserEngine.name, browserEngine.version,
              payout
            ];
            await doQuery(insertQuery, queryArray);
          }
          message = 'already inserted';
          const result = { message, href: whereToGo };
          responseHelper.send(result, 'post', res);
        }
      } else {
        console.log(`[${new Date().toLocaleString()}] invalid creatorTwitchId/campaignId - ${creatorTwitchId}, ${campaignId}`);
        responseHelper.promiseError(Error('Invalid Semantic Parameter'), next);
      }
    }
  }))
  .all(responseHelper.middleware.unusedMethod);

export default router;
