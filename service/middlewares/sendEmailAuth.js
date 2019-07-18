const axios = require('axios');
const config = require('../config.json');

const HOST = process.env.NODE_ENV === 'production' ? config.production.apiHostName : config.dev.apiHostName

sendEmailAuth = (req, response, next) =>{
  let user = {
    marketerId : req.body.marketerId,
    marketerMail : req.body.marketerMail
  }
  axios.post(`${HOST}/mailer/regist`, user)
  .then((res) => {
    //[false, error]
    //[true,  text]
    response.send(res.data);
  })
}

module.exports = sendEmailAuth;