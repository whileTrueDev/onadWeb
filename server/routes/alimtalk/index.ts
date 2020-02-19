
import express from 'express';
import axios from 'axios';

import doQuery from '../../model/doQuery';
import makeSignature from './makeSignature';
// import slack from '../../middlewares/slack/message';

interface NaverCloudButton {
  type: string;
  name: string;
  linkMobile: string;
  linkPc: string;
}

interface NaverCloudMessage {
  countryCode: string;
  to: string; // marketer phone number
  content: string;
  buttons: NaverCloudButton[];
}

interface NaverCloudMessageResponse {
  messageId: string;
  countryCode: string;
  to: string;
  content: string;
  requestStatusCode: string;
  requestStatusName: string;
  requestStatusDesc: string;
}

interface NaverCloudSendingData {
  templateCode: string;
  plusFriendId: string;
  messages: NaverCloudMessage[];
}

const router = express.Router();

// countryCodes
const COUNTRY_CODE_KR = '82';

// Setting global configurations
const SERVICE_ID = process.env.NAVER_CLOUD_BIZMESSAGE_SERVICE_ID;
const PLUS_FRIEND_ID = '@onad'; // kakao plus friends id
const NAVER_CLOUD_SENS_URL = 'https://sens.apigw.ntruss.com';
// for request
const ALIM_TALK_SERVICE_URL = `/alimtalk/v2/services/${SERVICE_ID}/messages`;

/**
 * @name 마케터캐시소진알림톡전송
 * @swagger
 * /alimtalk/marketer/cash/burn:
 *   post:
 *     tags: [Alimtalk]
 *     description: 마케터 캐시소진 알림톡 전송
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: marketerId
 *         description: 알림톡을 전송할 마케터 고유 ID
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: 알림톡 전송 완료
 */
router.get('/marketer/cash/burn', (req, res) => {
  // Get marketerId
  const { marketerId } = req.query;

  /** ********************
   * Setting Headers
   ******************** */
  // 현재 시간
  const nowtime = new Date().getTime().toString();
  // x-ncp-apigw-signature-v2 헤더 생성
  const SIGNATURE = makeSignature('POST', ALIM_TALK_SERVICE_URL, nowtime);

  const sendingHeader = {
    'Content-Type': 'application/json; charset=utf-8',
    'x-ncp-apigw-timestamp': nowtime,
    'x-ncp-iam-access-key': process.env.NAVER_CLOUD_ACCESS_KEY,
    'x-ncp-apigw-signature-v2': SIGNATURE
  };

  /** ********************
   * Setting seding data
   ******************** */
  const TEMPLATE_CODE = 'onadcash1'; // cash burn template code
  const BUTTON_TYPE = 'WL'; // Web Link button type
  const BUTTON_NAME = '온애드에서 확인하세요'; // Button name
  const LINK_MOBILE = 'https://onad.io';
  const LINK_PC = 'https://onad.io';

  function createSendingData({ marketerName, phonenum }:
    {marketerName: string; phonenum: string}): NaverCloudSendingData {
    const TEMPLATE_CONTENT = `안녕하세요! ${marketerName} 님\nOnAD 광고캐시가 거의 다 소진되었음을 알려드립니다. \n자세한 정보는 온애드에서 확인하세요.`;
    const sendingData = {
      templateCode: TEMPLATE_CODE,
      plusFriendId: PLUS_FRIEND_ID,
      messages: [
        {
          countryCode: COUNTRY_CODE_KR,
          to: phonenum, // marketer phone number
          content: TEMPLATE_CONTENT,
          buttons: [
            {
              type: BUTTON_TYPE,
              name: BUTTON_NAME,
              linkMobile: LINK_MOBILE,
              linkPc: LINK_PC
            }
          ]
        }
      ]
    };
    return sendingData;
  }

  const marketerInfoQuery = 'SELECT marketerName, marketerPhoneNum FROM marketerInfo WHERE marketerId = ?';
  const marketerInfoArray = [marketerId];

  doQuery(marketerInfoQuery, marketerInfoArray).then((row) => {
    if (!row.error && row.result.length > 0) {
      const { marketerName } = row.result[0];
      const phonenum = row.result[0].marketerPhoneNum.replace(/[^0-9]/g, '');

      axios.post(NAVER_CLOUD_SENS_URL + ALIM_TALK_SERVICE_URL,
        createSendingData({ marketerName, phonenum }),
        {
          headers: sendingHeader
        })
        .then((data) => {
          // 알림톡 내역 저장. - kakaoAlimtalk 테이블.
          const {
            requestId, requestTime, statusCode, statusName, messages
          } = data.data; // 요청 데이터 추출

          messages.forEach((message: NaverCloudMessageResponse) => {
            const {
              messageId, countryCode, to, content, requestStatusCode,
              requestStatusName, requestStatusDesc
            } = message; // 메세지 데이터 추출

            const kakaoAlimtalkInsertQuery = `
            INSERT INTO kakaoAlimtalk
              (
                requestId, requestTime, statusCode, statusName,
                messages_messageId, messages_countryCode, messages_to,
                messages_content, messages_requestStatusCode,
                messages_requestStatusName, messages_requestStatusDesc
              )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;

            const queryArray = [
              requestId, requestTime, statusCode, statusName,
              messageId, countryCode, to,
              content, requestStatusCode,
              requestStatusName, requestStatusDesc
            ];

            doQuery(kakaoAlimtalkInsertQuery, queryArray).then((row1) => {
              if (row1.error) {
                console.log(`마케터 알림톡 전송 - ${marketerId} db 적재 에러`);
              } else {
                // slack push
                // slack.push(`${marketerId} ${TEMPLATE_CODE} 알림톡 전송 완료`, '마케터 캐시소진 알림톡');
              }
              res.sendStatus(201).send('successfully posted');
            });
          });
        }).catch((err) => {
          // 알림톡 실패 내역 저장.
          console.log(`err in alimtalk - ${marketerId} `, err.response.data.error);
          const { errorCode, message, details } = err.response.data.error;
          // slack push
          // slack.push(`${marketerId} ${TEMPLATE_CODE} 알림톡 전송 실패 - 오류:\n\nerror-code: ${
          //   errorCode} error-message: ${message} error-details: ${details}`,
          // '마케터 캐시소진 알림톡');
        });
    } else {
      // invalid marketerId
      res.sendStatus(400).send('invalid marketerId');
    }
  });
});

export default router;
