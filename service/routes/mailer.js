var express = require('express');
const nodemailer = require('nodemailer');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/nodemailerTest", function(req, res, next){
  let email = req.body.email;

  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'newage3333@gmail.com',  // gmail 계정 아이디를 입력
          pass: '@kdgage1976'          // gmail 계정의 비밀번호 : 내꺼 다 털리는거 아이가
      }
  });

  let mailOptions = {
    from: 'newage3333@gmail.com', // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: email, // 수신 메일 주소부분
    subject: '노드메일러 테스트중', // 제목부분인듯
    html: '<p>아래의 링크를 클릭해보이소 !</p>' +
          "<a href='http://localhost:3001/auth/?email="+ email +"&token=abcdefg'>인증하기</a>"   // 내용부분 토큰은 나중에 암호화하깅
  };

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      }
      else {
          console.log('Email sent: ' + info.response);
      }
  });

  res.redirect("/");
})

router.get("/auth", function(req, res, next){
  let email = req.query.email;
  let token = req.query.token; // token이 일치하면 테이블에서 email을 찾아 회원가입 승인 로직 구현 --> 토큰 암호화 필요
})

module.exports = router;
