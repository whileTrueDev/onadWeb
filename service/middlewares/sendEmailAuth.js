const axios = require('axios');

sendEmailAuth = (req, res, next) =>{
  let user = {
    marketerId : req.body.marketerId,
    marketerMail : req.body.marketerMail
  }
  axios.post('http://localhost:3001/mailer/regist', user)
  .then((res) => {
    console.log(res.data);
  })
  .catch((err)=>{
    console.log(err);
  })
  res.send('작성하신 이메일으로 본인인증 메일을 발송하였습니다. 해당 경로로 로그인 해주세요.');
}

module.exports = sendEmailAuth;