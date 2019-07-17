const express = require('express');
const nodemailer = require('nodemailer');
const logger = require('../middlewares/logger');
const router = express.Router();

//인증을 위한 Mailer
router.post("/auth", (req, res) => {
  const {marketerMail, marketerId, password} = req.body;
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'onad6309@gmail.com',  // gmail 계정 아이디를 입력
          pass: 'rkdghktn12'          // gmail 계정의 비밀번호 : 내꺼 다 털리는거 아이가
      }
  });
  let mailOptions = {
    from: 'onad6309@gmail.com', // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: marketerMail, // 수신 메일 주소부분
    subject: `[ONAD] ${marketerId} 님, 임시비밀번호입니다.`, // 제목부분인듯
    html: `<p>고객님의 임시비밀번호는 ${password} 입니다.</p>` +
          "<a href='http://localhost:3001/'>ONAD 홈페이지</a>"   // 내용부분 토큰은 나중에 암호화하깅
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      logger.error('Email 전송오류 : '  + error.response);
      res.send({
        error : error.response,
        result : null,
      });
    }
    else {
      logger.info('Email sent: ' + info.response);
      res.send({
        error : null,
        result : info.response,
      });
    }
  });
})

router.post("/regist", function(req, res, next){
  let email = req.body.marketerMail;
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: 'onad6309@gmail.com',
          pass: 'rkdghktn12'          
      }
  });
  let mailOptions = {
    from: 'onad6309@gmail.com', // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: email, // 수신 메일 주소부분
    subject: `[ONAD] ${req.body.marketerId} 님, 가입을 환영합니다.`, // 제목부분인듯
    html: `<p>ONAD 가입을 축하드립니다!</p>` +
          `<a href="http://localhost:3000/api/regist/auth/${req.body.marketerId}">해당 링크 클릭을 통해 인증을 완료하세요!</a>`   // 내용부분 토큰은 나중에 암호화하깅
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      logger.error('Email 전송오류 : '  + error.response);
      res.send({
        error : error.response
      });
    }
    else {
      logger.info('Email sent: ' + info.response);
      res.send({
        error : null,
        result : info.response,
      });
    }
  });
})

module.exports = router;
