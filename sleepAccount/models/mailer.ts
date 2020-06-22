/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.

import nodemailer from 'nodemailer';
import logger from '../middleware/logger';
import makeMarketerRegistTemplate from '../middleware/mailTemplate/sleepMail';

// const router = express.Router();
const mailer = (mailAdr: string, marketerId: string, dDay: string): void => {
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
      logger.error(`Email 전송오류 : ${error}`);
      console.log('error', error);
    } else {
      logger.info(`Email sent: ${info.response}`);
    }
  });
};

export default mailer;
