const axios = require('axios');

const HOST = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_API_HOSTNAME
  : process.env.DEV_API_HOSTNAME;

const sendEmailAuth = (req, response) => {
  const user = {
    marketerId: req.body.marketerId,
    marketerMail: req.body.marketerMail
  };
  axios.post(`${HOST}/mailer/regist`, user)
    .then((res) => {
    // [false, error]
    // [true,  text]
      response.send(res.data);
    });
};

module.exports = sendEmailAuth;
