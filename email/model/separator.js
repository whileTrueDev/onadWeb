const pool = require('./connect');

module.exports = async function (marketerId) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) return err;
      const separateQuery = `INSERT INTO sleepMarketer (
        marketerId,
          marketerPasswd,
          marketerSalt,
          marketerName,
          marketerMail,
          marketerPhoneNum,
          marketerBusinessRegNum,
          marketerBusinessRegSrc,
          marketerUserType,
          marketerContraction,
          marketerAlarmAgreement,
          marketerEmailAuth,
          date,
          temporaryLogin,
          marketerAccountNumber,
          accountHolder
        ) SELECT 
        marketerId,
          marketerPasswd,
          marketerSalt,
          marketerName,
          marketerMail,
          marketerPhoneNum,
          marketerBusinessRegNum,
          marketerBusinessRegSrc,
          marketerUserType,
          marketerContraction,
          marketerAlarmAgreement,
          marketerEmailAuth,
          date,
          temporaryLogin,
          marketerAccountNumber,
          accountHolder
         FROM marketerInfo WHERE marketerInfo.marketerId = ?;`;
      conn.query(separateQuery, marketerId, (err, result, fields) => {
        conn.release();
        if (err) return err;
      });
    });
  });
};
