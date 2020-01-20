const pool = require('./connect');

module.exports = async function (marketerId) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) return err;
      const separateQuery = 'DELETE FROM marketerInfo WHERE marketerId = ?;';
      conn.query(separateQuery, marketerId, (err, result, fields) => {
        conn.release();
        if (err) return err;
      });
    });
  });
};
