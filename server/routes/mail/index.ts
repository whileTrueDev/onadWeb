import express from 'express';
import nodemailer from 'nodemailer';
import responseHelper from '../../middlewares/responseHelper';
import makeMarketerRegistTemplate from '../../middlewares/mailTemplate/marketerRegist';
import makeMarketerRepassword from '../../middlewares/mailTemplate/marketerRepassword';
import logger from '../../middlewares/logger';
import doQuery from '../../model/doQuery';
import makeInqurie from '../../middlewares/mailTemplate/makeInqurie';
import makeCreatorInquiry from '../../middlewares/mailTemplate/makeCreatorInquiry';

const router = express.Router();

const HOST = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_API_HOSTNAME
  : process.env.DEV_API_HOSTNAME;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD
  }
});

interface InputForm {
  name: string;
  email: string;
  contactNumber: number;
  brandName?: string;
  content: string;
}

router.route('/inquiry')
  .post(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const inputForm: InputForm = req.body;
      // req.body는 x-www-form-urlencoded
      const mailOptions = {
        from: `${inputForm.email}`, // 발송 메일 주소
        to: 'support@onad.io', // 수신 메일 주소부분
        subject: `${inputForm.name}님의 캠페인 문의 요청입니다.`, // 제목부분
        html: makeInqurie(inputForm),
        // attachments: [{
        //   filename: 'onad_logo_vertical_small.png',
        //   path: `${process.env.ROOT_PATH}/public/onad_logo_vertical_small.png`,
        //   cid: 'logo'
        // }]
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error(`Email 전송오류 : ${error}`);
          throw new Error(`Error in /mail/inquiry - ${error}`);
        } else {
          logger.info(`Email sent: ${info.response}`);
          res.sendStatus(200);
        }
      });
    })
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/inquiry/creator')
  .post(
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      const inputForm: InputForm = req.body;
      // req.body는 x-www-form-urlencoded
      const mailOptions = {
        from: `${inputForm.email}`, // 발송 메일 주소
        to: 'support@onad.io', // 수신 메일 주소부분
        subject: `${inputForm.name}님의 크리에이터 문의 입니다.`, // 제목부분
        html: makeCreatorInquiry(inputForm),
        // attachments: [{
        //   filename: 'onad_logo_vertical_small.png',
        //   path: `${process.env.ROOT_PATH}/public/onad_logo_vertical_small.png`,
        //   cid: 'logo'
        // }]
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error(`Email 전송오류 : ${error}`);
          throw new Error(`Error in /mail/inquiry/creator - ${error}`);
        } else {
          logger.info(`Email sent: ${info.response}`);
          res.sendStatus(200);
        }
      });
    })
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/auth')
  .post(
    // 회원가입에 대한 본인인증 이메일 발송
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const [marketerId, marketerMail] = responseHelper.getParam(['marketerId', 'marketerMail'], 'POST', req);
      const mailOptions = {
        from: 'ONAD <support@onad.io>', // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
        to: marketerMail, // 수신 메일 주소부분
        subject: `[ONAD] ${req.body.marketerId} 님, 가입을 환영합니다.`, // 제목부분인듯
        html: makeMarketerRegistTemplate(`${HOST}/mail/auth/${marketerId}`),
        // attachments: [{
        //   filename: 'onad_logo_vertical_small.png',
        //   path: `${process.env.ROOT_PATH}/public/onad_logo_vertical_small.png`,
        //   cid: 'logo'
        // }]
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error(`Email 전송오류 : ${error}`);
          console.log(`Email 전송오류 : ${error}`);
          res.send({
            error
          });
        } else {
          logger.info(`Email sent: ${info.response}`);
          res.send({
            error: null,
            result: info.response,
          });
        }
      });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/auth/:id')
  .get(
    // 회원가입에 대한 본인인증 marketerEmailAuth값 1로 변경
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      console.log('본인인증에 대한 접근입니다.');
      doQuery(`
      UPDATE marketerInfo
      SET marketerEmailAuth = 1
      WHERE marketerId = ?`, [req.params.id])
        .then(() => {
          res.redirect(HOST as string);
        })
        .catch(() => {
          res.redirect(HOST as string);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/tmp-auth')
  .post(
    // 임시 비밀번호 생성에 대한 이메일 전송
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const [marketerMail, marketerId, password] = responseHelper.getParam(['marketerMail', 'marketerId', 'password'], 'POST', req);
      const mailOptions = {
        from: 'ONAD <support@onad.io>', // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
        to: marketerMail, // 수신 메일 주소부분
        subject: `[ONAD] ${marketerId} 님, 임시 비밀번호가 발급 되었습니다.`, // 제목부분인듯
        html: makeMarketerRepassword(marketerId, password),
        // attachments: [{
        //   filename: 'onad_logo_vertical_small.png',
        //   path: `${process.env.ROOT_PATH}/public/onad_logo_vertical_small.png`,
        //   cid: 'logo'
        // }]
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error(`Email 전송오류 : ${error}`);
          console.log(`Email 전송오류 : ${error}`);
          res.send({ error });
        } else {
          logger.info(`Email sent: ${info.response}`);
          responseHelper.send(JSON.stringify({
            error: false,
          }), 'post', res);
        }
      });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
