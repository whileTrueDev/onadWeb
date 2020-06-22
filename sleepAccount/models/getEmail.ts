import doQuery from '../middleware/doQuery/doQuery';

interface MailAdress {
  marketerMail: string;
}
async function getEmail(userId: string): Promise<MailAdress> {
  const selectQuery = `
                      SELECT marketerMail 
                      FROM marketerInfo 
                      WHERE marketerId = ?
                      ;`;

  return new Promise((resolve, reject) => {
    doQuery(selectQuery, [userId])
      .then((row) => {
        resolve(row.result[0]);
      })
      .catch((errorData) => {
        reject(errorData);
      });
  });
}

export default getEmail;
