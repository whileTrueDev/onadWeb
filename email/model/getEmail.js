const sql = require('./select');

module.exports = async function (userId) {
  const selectQuery = sql(`SELECT marketerMail FROM marketerInfo WHERE marketerId = "${userId}"`);

  // console.log('함수실행', data, '////');
  return new Promise((resolve, reject) => {
    selectQuery.select((err, data) => {
      if (err) {
        console.log(err);
      } else {
        resolve(data);
      }
    });
  });
};
