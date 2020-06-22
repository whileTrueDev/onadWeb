import doQuery from '../middleware/doQuery/doQuery';

interface RecordData {
  userId: string;
  date: Date;
}
async function checkLastLogin(): Promise<any[]> {
  const selectQuery = `SELECT ls.userId, ls.date FROM loginStamp AS ls 
                      INNER JOIN (SELECT userId, MAX(date) AS maxDate FROM loginStamp GROUP BY userId) AS ls2
                      ON ls.userId = ls2.userId AND ls.date = ls2.maxDate
                      ORDER BY ls.date`; // 아이디별 가장 마지막 로그인 기록

  return new Promise((resolve, reject) => {
    doQuery(selectQuery).then((row) => {
      resolve(row.result);
    })
      .catch((errorData) => {
        reject(errorData);
      });
  });
}

export default checkLastLogin;
