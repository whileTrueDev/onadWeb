import doQuery from '../middleware/doQuery/doQuery';

async function doDelete(marketerId: string) {
  return new Promise((resolve, reject) => {
    const separateQuery = 'DELETE FROM marketerInfo WHERE marketerId = ?;';
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
export default doDelete;
