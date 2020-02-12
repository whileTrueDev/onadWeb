const axios = require('axios');
const doQuery = require('../model/doQuery');
const encrypto = require('../encryption');

const HOST = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_API_HOSTNAME
  : process.env.DEV_API_HOSTNAME;

const setTemporaryPassword = (req, res, next) => {
  // 임시비밀번호 생성.
  let password = '';
  let key; let
    salt;

  for (let i = 0; i < 8; i++) {
    const lowerStr = String.fromCharCode(Math.floor(Math.random() * 26 + 97));
    if (i % 2 == 0) {
      password += String(Math.floor(Math.random() * 10));
    } else {
      password += lowerStr;
    }
  }

  [key, salt] = encrypto.make(password);

  doQuery('UPDATE marketerInfo SET marketerSalt = ?, marketerPasswd = ?, temporaryLogin = 1 WHERE marketerId = ? ', [salt, key, req.body.marketerId])
    .then(() => {
      const user = {
        marketerId: req.body.marketerId,
        marketerMail: req.body.marketerMail,
        password,
        baseUrl: req.baseUrl
      };
      axios.post(`${HOST}/mailer/auth`, user)
        .then((response) => {
          // 메일 전송 오류 및 성공.
          res.send(response.data);
        });
    })
    .catch((data) => {
    // 쿼리문이나 커넥션에 대한 에러
      res.send(data);
    });
};

module.exports = setTemporaryPassword;
