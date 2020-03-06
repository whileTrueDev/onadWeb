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
  contactNumber?: number;
  brandName?: string;
  content?: string;
}

router.route('/')
  .post(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      let inputForm: InputForm;
      //req.body는 x-www-form-urlencoded
      inputForm = req.body;
      const mailOptions = {
        from: `${inputForm.email}`, // 발송 메일 주소
        to: 'onad6309@gmail.com', // 수신 메일 주소부분
        subject: `${inputForm.name}님의 캠페인 문의 요청입니다.`, // 제목부분
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
          throw new Error(`Error in /mail/inquiry - ${error}`)
        } else {
          logger.info(`Email sent: ${info.response}`);
          res.send(200);
        }
      });
    })
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;