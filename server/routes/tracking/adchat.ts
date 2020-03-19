import express from 'express';
import uaparser from 'ua-parser-js';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery';

const router = express.Router();

router.route('/')
  .post(responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const NowIp: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(req.query);
    const [campaignId, referrer, userAgent] = responseHelper.getParam(['campaignId', 'referrer', 'userAgent'], 'post', req);
    console.log('ip: ', NowIp);
    console.log('campaignId: ', campaignId);
    console.log('referrer: ', referrer);

    const UA = new uaparser.UAParser(userAgent);
    const device = UA.getDevice();
    const Browser = UA.getBrowser();
    const OS = UA.getOS();
    const Engine = UA.getEngine();
    const CPU = UA.getCPU();

    console.log(device, Browser, OS, Engine, CPU);
    // { vendor: undefined, model: undefined, type: undefined }
    // { name: 'Chrome', version: '79.0.3945.130', major: '79' }
    // { name: 'Mac OS', version: '10.15.3' }
    // { name: 'Blink', version: '79.0.3945.130' }
    // { architecture: undefined }


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
    agent: 접속자: user-agent
    payout: 금액
    */

    // const query = `

    // `;

    // const row = await doQuery(query, [campaignId]);


    const result = {
      message: 'success',
      href: 'https://youtube.com'
    };
    responseHelper.send(result, 'post', res);
  }))
  .all(responseHelper.middleware.unusedMethod);

export default router;
