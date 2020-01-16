const express = require('express');
const axios = require('axios').default;
// const doQuery = require('../../model/doQuery');
const { makeSignature } = require('../../middlewares/naverCloud');

const router = express.Router();

const serviceId = process.env.NAVER_CLOUD_BIZMESSAGE_SERVICE_ID;
const plusFriendId = '@onad'; // kakao plus friends id
const NAVER_CLOUD_SENS_URL = 'https://sens.apigw.ntruss.com';
const ALIM_TALK_SERVICE_URL = `/alimtalk/v2/services/${serviceId}/messages`; // for request

// marketer 의 캐시 소진 알림톡을 위한 라우터. (from 계산프로그램)
router.get('/marketer/cash/burn', (req, res) => {
  const { marketerId } = req.query;
  console.log('알림톡 요청 ', marketerId);

  // 현재 시간
  const nowtime = new Date().getTime().toString();
  console.log(nowtime);
  // x-ncp-apigw-signature-v2 헤더 생성
  const signature = makeSignature('POST', ALIM_TALK_SERVICE_URL, nowtime);

  // Setting variables
  const templateCode = 'onadcash1'; // cash burn template code
  const buttonType = 'WL'; // Web Link button type
  const buttonName = '온애드에서 확인하세요'; // Button name
  const linkMobile = 'https://onad.io';
  const linkPc = 'https://onad.io';

  const sendingData = JSON.stringify({
    plusFriendId,
    templateCode,
    message: [{
      // countryCode: '+82',
      to: '01039745175',
      content: `안녕하세요! 강화수님
      OnAD 광고캐시가 거의 다 소진되었음을 알려드립니다.
      자세한 정보는 온애드에서 확인하세요.`,
      buttons: [{
        type: buttonType,
        name: buttonName,
        linkPc,
        linkMobile,
      }]
    }]
  });

  console.log(NAVER_CLOUD_SENS_URL + ALIM_TALK_SERVICE_URL);

  const sendingHeader = {
    'content-type': 'application/json; charset=utf-8',
    'x-ncp-apigw-timestamp': nowtime,
    'x-ncp-iam-access-key': process.env.NAVER_CLOUD_ACCESS_KEY,
    'x-ncp-apigw-signature-v2': signature
  };
  axios.post(NAVER_CLOUD_SENS_URL + ALIM_TALK_SERVICE_URL,
    sendingData, sendingHeader)
    .then((data) => {
      console.log(`data ${data}`);
      res.send('');
    }).catch((err) => {
      console.log(`err ${err}`);
      res.send('');
    });
});

module.exports = router;
