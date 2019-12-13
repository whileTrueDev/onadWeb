const sql = require('./select');

module.exports = async function () {
  const selectQuery = sql(`SELECT * FROM loginStamp AS ls 
                          INNER JOIN (SELECT userId, MAX(date) AS maxDate FROM loginStamp GROUP BY userId) AS ls2
                          ON ls.userId = ls2.userId AND ls.date = ls2.maxDate
                          ORDER BY ls.date`);

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
