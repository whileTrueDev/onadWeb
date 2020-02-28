import express, { response } from 'express'
import responseHelper from '../../../middlewares/responseHelper'
import makeInqurie from '../../../middlewares/mailTemplate/makeInqurie';
import logger from '../../../middlewares/logger'
import nodemailer from 'nodemailer';

const router = express.Router();

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
  name?: string;
  email?: string;
}

router.route('/')
  .post(
    // responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { name, email } = req.body;
      let inputForm: InputForm;
      inputForm = { name: 'kevin2022', email: 'kevin2022@naver.com' }
      const mailOptions = {
        from: `${inputForm.email}`, // 발송 메일 주소
        to: 'kevin2022@naver.com', // 수신 메일 주소부분
        subject: `${name}님의 캠페인 문의 요청입니다.`, // 제목부분
        html: makeInqurie(inputForm),
        attachments: [{
          filename: 'onad_logo_vertical_small.png',
          path: `${process.env.ROOT_PATH}/images/onad_logo_vertical_small.png`,
          cid: 'logo'
        }]
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error(`Email 전송오류 : ${error}`);
          console.log(`Email 전송오류 : ${error}`);
          responseHelper.send({
            error: error
          }, 'post', res);
        } else {
          logger.info(`Email sent: ${info.response}`);
          responseHelper.send({
            error: null,
            result: 200,
          }, 'post', res);
        }
      });
      // responseHelper.send(200, 'get', res);
    })
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;