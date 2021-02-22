import express from 'express';
import slackMessage from '../../lib/slack/messageWithJson';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery';

const router = express.Router();

interface Inquiry {
  name: string;
  email: string;
  inquiryContents: string;
  privacyAgreement: boolean;
}

interface MarketerInquiry extends Inquiry {
  contactNumber: number; brandName?: string; homepage?: string;
}

interface CreatorInquiry extends Inquiry {
  usingPlatform: string;
}

router.route('/')
  .post(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const {
        name, email, contactNumber,
        brandName, homepage, inquiryContents, privacyAgreement
      }: MarketerInquiry = req.body;

      const query = `
      INSERT INTO marketerInquiry (
        name, email, contactNumber, brandName,
        homepage, inquiryContents, privacyAgreement
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const queryArray = [
        name, email, contactNumber, brandName,
        homepage, inquiryContents, privacyAgreement ? 1 : 0
      ];
      const row = await doQuery(query, queryArray);
      if (row.result) {
        responseHelper.send(row.result, 'post', res);
        // onad_alarm 슬랙 채널에 알림메시지 보내기
        slackMessage({
          summary: '마케터 문의 요청 알림',
          text: '관리자 페이지에서 방금 등록된 마케터의 문의를 확인하고, 응답하세요.',
          fields: [
            { title: '마케터 이름', value: name, short: true },
            { title: '브랜드 이름', value: brandName || '입력안함', short: true },
            { title: '마케터 홈페이지', value: homepage || '입력안함', short: true },
            {
              title: '문의 내용',
              value: inquiryContents.length >= 20 ? `${inquiryContents.slice(0, 20)}...` : inquiryContents,
              short: true
            },
          ]
        });
      }
    })
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/creator')
  .post(
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      const {
        name, email, usingPlatform, inquiryContents, privacyAgreement
      }: CreatorInquiry = req.body;

      const query = `
      INSERT INTO creatorInquiry (
        name, email, usingPlatform, inquiryContents, privacyAgreement
      ) VALUES (?, ?, ?, ?, ?)`;
      const queryArray = [
        name, email, usingPlatform, inquiryContents, privacyAgreement ? 1 : 0
      ];
      const row = await doQuery(query, queryArray);
      if (row.result) {
        responseHelper.send(row.result, 'post', res);
        // onad_alarm 슬랙 채널에 알림메시지 보내기
        slackMessage({
          summary: '방송인 문의 요청 알림',
          text: '관리자 페이지에서 방금 등록된 방송인의 문의를 확인하고, 응답하세요.',
          fields: [
            { title: '방송인 이름', value: name, short: true },
            { title: '이용중인 플랫폼', value: usingPlatform, short: true },
            {
              title: '문의 내용',
              value: inquiryContents.length >= 20 ? `${inquiryContents.slice(0, 20)}...` : inquiryContents,
              short: true
            },
          ]
        });
      }
    })
  )
  .all(responseHelper.middleware.unusedMethod);


export default router;
