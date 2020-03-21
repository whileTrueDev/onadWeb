
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

// countryCodes
const COUNTRY_CODE_KR = '82';

// Setting global configurations
const SERVICE_ID = process.env.NAVER_CLOUD_BIZMESSAGE_SERVICE_ID;
const PLUS_FRIEND_ID = '@onad'; // kakao plus friends id
const NAVER_CLOUD_SENS_URL = 'https://sens.apigw.ntruss.com';
// for request
const ALIM_TALK_SERVICE_URL = `/alimtalk/v2/services/${SERVICE_ID}/messages`;

const router = express.Router();

/**
 * @name 마케터캐시소진알림톡전송
 * @swagger
 * /alimtalk/marketer/cash/burn:
 *   post:
 *     tags: [alimtalk]
 *     summary: 마케터 캐시소진 알림톡 전송
 *     description: param으로 받는 마케터 아이디에 따라 해당 마케터에게 알림톡을 전송하는 요청
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: marketerId
 *         description: 알림톡을 전송할 마케터 고유 ID
 *         required: true
 *         in: body
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *       201:
 *         description: Created
 *       400:
 *         $ref: '#/responses/400'
 *       401:
 *         $ref: '#/responses/401'
 *       404:
 *         $ref: '#/responses/404'
 * */
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
    const TEMPLATE_CONTENT = `안녕하세요! ${marketerName} 님\nOnAD 광고캐시가 대부분 소진되었음을 알려드립니다. \n자세한 정보는 온애드에서 확인하세요.`;
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

/**
 * @name 캠페인정의
 * @swagger
 * definitions:
 *   campaign:
 *     type: "object"
 *     properties:
 *       campaignId:
 *         type: string
 *         description: 캠페인의 고유 아이디
 *       campaignName:
 *         type: string
 *         description: 캠페인 명
 *       marketerId:
 *         type: string
 *         description: 캠페인 소유 마케터 아이디
 *       marketerName:
 *         type: string
 *         description: 캠페인 소유 마케터 이름
 *       bannerId:
 *         type: string
 *         description: 캠페인에 할당된 배너 아이디
 *       connectedLinkId:
 *         type: string
 *         description: 캠페인에 할당된 랜딩url 아이디
 *       dailyLimit:
 *         type: integer
 *         description: 캠페인 일일 비용 예산
 *       limitState:
 *         type: integer
 *         description: 일일 비용 예산을 넘었는지 안넘었는지 상태값
 *         enum:
 *           - 넘음
 *           - 안 넘음
 *         default: 안넘음
 *       priorityType:
 *         type: integer
 *         description: 우선순위 타입
 *         enum:
 *           - 크리에이터 선택형
 *           - 게임 선택형
 *           - 노출 우선형
 *       optionType:
 *         type: string
 *         description: 캠페인광고 유형
 *         enum:
 *           - CPM
 *           - CPMCPC
 *           - CPC
 *       onOff:
 *         type: integer
 *         description: 캠페인 활성화/비활성화 상태값
 *         enum:
 *           - on
 *           - off
 *       deletedState:
 *         type: integer
 *         description: 캠페인 삭제 상태값
 *         enum:
 *           - 미삭제
 *           - 삭제
 *       regiDate:
 *         type: string
 *         description: 캠페인 생성 날짜
 *         format: date-time
 *       updateDate:
 *         type: string
 *         description: 캠페인이 업데이트된 가장 최신의 날짜
 *         format: date-time
 *       stopDate:
 *         type: string
 *         description: 광고가 정지된 시점 (광고비가 모두 소진되어 광고가 끝나는 시점을 기록 )
 *         format: date-time
 *       targetList:
 *         type: string
 *         description: 캠페인에 대한 카테고리ID / 크리에이터ID 모음
 *       keyword:
 *         type: jsonstring
 *         description: 해당캠페인에 대한 키워드들 모음 json형태 문자열
 *       startDate:
 *         type: string
 *         description: 광고주가 설정한 캠페인 시작일
 *         format: date-time
 *       finDate:
 *         type: string
 *         description: 광고주가 설정한 캠페인 종료일
 *         format: date-time
 *       selectedTime:
 *         type: string
 *         description: 광고주가 설정한 캠페인 송출 시간대 ( | 로 구분)
 */

/**
 * @name 응답코드정의
 * @swagger
 * responses:
 *   400:
 *     description: Bad Requests
 *     schema:
 *       $ref: '#/definitions/Error'
 *   401:
 *     description: Unauthorized
 *     schema:
 *       $ref: '#/definitions/Error'
 *   403:
 *     description: Forbidden
 *     schema:
 *       $ref: '#/definitions/Error'
 *   404:
 *     description: Not Found
 *     schema:
 *       $ref: '#/definitions/Error'
 *   405:
 *     description: Method Not Allowed
 *     schema:
 *       $ref: '#/definitions/Error'
 *   429:
 *     description: Too Many Requests
 *     schema:
 *       $ref: '#/definitions/Error'
 *   5XX:
 *     description: Internal Server Error
 *     schema:
 *       $ref: '#/definitions/Error'
 */

/**
 * @name 응답객체정의
 * @swagger
 * definitions:
 *   Error:
 *     type: object
 *     properties:
 *       code:
 *         type: string
 *       message:
 *         type: string
 *     required:
 *       - code
 *       - message
 */

export default router;
