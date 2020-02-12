const express = require('express');
const nodemailer = require('nodemailer');
const logger = require('../middlewares/logger');
const makeMarketerRegistTemplate = require('../middlewares/mailTemplate/marketerRegist');
const makeMarketerRepassword = require('../middlewares/mailTemplate/marketerRepassword');
const makeInqurie = require('../middlewares/mailTemplate/makeInqurie');

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

// 인증을 위한 Mailer
router.post('/auth', (req, res) => {
  const { marketerMail, marketerId, password } = req.body;

  const mailOptions = {
    from: 'ONAD <support@onad.io>', // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: marketerMail, // 수신 메일 주소부분
    subject: `[ONAD] ${marketerId} 님, 임시 비밀번호가 발급 되었습니다.`, // 제목부분인듯
    html: makeMarketerRepassword(marketerId, password),
    attachments: [{
      filename: 'onad_logo_vertical_small.png',
      path: `${process.env.ROOT_PATH}/images/onad_logo_vertical_small.png`,
      cid: 'logo'
    }]
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(`Email 전송오류 : ${error.response}`);
      res.send({
        error: error.response,
        result: null,
      });
    } else {
      logger.info(`Email sent: ${info.response}`);
      res.send({
        error: null,
        result: info.response,
      });
    }
  });
});

router.post('/regist', (req, res, next) => {
  const email = req.body.marketerMail;
  const mailOptions = {
    from: 'ONAD <support@onad.io>', // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: email, // 수신 메일 주소부분
    subject: `[ONAD] ${req.body.marketerId} 님, 가입을 환영합니다.`, // 제목부분인듯
    html: makeMarketerRegistTemplate(`${HOST}/api/regist/auth/${req.body.marketerId}`),
    attachments: [{
      filename: 'onad_logo_vertical_small.png',
      path: `${process.env.ROOT_PATH}/images/onad_logo_vertical_small.png`,
      cid: 'logo'
    }]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(`Email 전송오류 : ${error.response}`);
      console.log(`Email 전송오류 : ${error}`);
      res.send({
        error: error.response
      });
    } else {
      logger.info(`Email sent: ${info.response}`);
      res.send({
        error: null,
        result: info.response,
      });
    }
  });
});

// 마케터 캠페인 문의
router.post('/inqurie', (req, res, next) => {
  const { name, email } = req.body;

  const mailOptions = {
    from: `${email}`, // 발송 메일 주소
    to: 'support@onad.io', // 수신 메일 주소부분
    subject: `${name}님의 캠페인 문의 요청입니다.`, // 제목부분
    html: makeInqurie(req.body),
    attachments: [{
      filename: 'onad_logo_vertical_small.png',
      path: `${process.env.ROOT_PATH}/images/onad_logo_vertical_small.png`,
      cid: 'logo'
    }]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(`Email 전송오류 : ${error.response}`);
      console.log(`Email 전송오류 : ${error}`);
      res.send({
        error: error.response
      });
    } else {
      logger.info(`Email sent: ${info.response}`);
      res.send({
        error: null,
        result: info.response,
      });
    }
  });
});

module.exports = router;
