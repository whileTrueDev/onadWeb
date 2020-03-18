import express from 'express';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery';

const router = express.Router();

router.route('/:campaignId')
  .get(responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const { campaignId } = req.params;
    console.log(campaignId);

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
      href: 'http://youtube.com'
    };
    responseHelper.send(result, 'get', res);
  }))
  .all(responseHelper.middleware.unusedMethod);

export default router;
