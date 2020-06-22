import doQuery from '../middleware/doQuery/doQuery';

async function separator(marketerId: string) {
  return new Promise((resolve, reject) => {
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
    doQuery(separateQuery, [marketerId])
      .then((row) => {
        // console.log(row.result);
        resolve(row.result);
      })
      .catch((errorData) => {
        reject(errorData);
      });
  });
}

export default separator;
