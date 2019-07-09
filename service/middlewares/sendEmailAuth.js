const axios = require('axios');

sendEmailAuth = (req, response, next) =>{
  let user = {
    marketerId : req.body.marketerId,
    marketerMail : req.body.marketerMail
  }
  axios.post('http://localhost:3000/mailer/regist', user)
  .then((res) => {
    //[false, error]
    //[true,  text]
    response.send(res.data);
  })
}

module.exports = sendEmailAuth;