const axios = require('axios');

const HOST = process.env.NODE_ENV === 'production' ? 'https://api.onad.io' : 'http://localhost:3000';

const sendAlimtalk = marketerId => new Promise((resolve, reject) => {
  axios.get(`${HOST}/api/alimtalk/marketer/cash/burn?marketerId=${marketerId}`)
    .then(() => {
      console.log('전달이 완료 되었습니다.');
      resolve();
    })
    .catch((error) => {
      // console.log(error);
      console.log('서버와의 연결이 올바르지 않습니다.');
      resolve();
    });
});

module.exports = sendAlimtalk;
// sendAlimtalk('dn0208');
