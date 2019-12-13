const express = require('express');
const nodemailer = require('nodemailer');
const logger = require('../middleware/logger');
const makeMarketerRegistTemplate = require('../middleware/mailTemplate/sleepMail');

// const router = express.Router();
const mailer = (mailAdr, marketerId, dDay) => {
  const HOST = process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_API_HOSTNAME
    : process.env.DEV_API_HOSTNAME;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: 'onad6309@gmail.com',
      pass: 'rkdghktn12'
    }
  });
  console.log('mailer:', mailAdr);
  const email = mailAdr;
  const mailOptions = {
    from: 'ONAD <support@onad.io>', // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: email, // 수신 메일 주소부분
    subject: `[ONAD] ${marketerId} 님, 휴면전환 예정 알림.`, // 제목부분인듯
    html: makeMarketerRegistTemplate(marketerId, dDay),
    // attachments: [{
    //   filename: 'onad_logo_vertical_small.png',
    //   path: `${process.env.ROOT_PATH}/images/onad_logo_vertical_small.png`,
    //   cid: 'logo'
    // }]
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(`Email 전송오류 : ${error.response}`);
      console.log('error', error);
    } else {
      logger.info(`Email sent: ${info.response}`);
    }
  });
};
module.exports = mailer;
