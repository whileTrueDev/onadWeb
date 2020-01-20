const pool = require('./connect');

module.exports = function (sqlQuery, queryArray) {
  return {
    select(callback) {
      pool.getConnection((err, conn) => {
        if (err) return callback(err);
        const sql = sqlQuery;
        conn.query(sql, queryArray, (err, result, fields) => {
          conn.release();
          if (err) return callback(err);
          callback(null, result);
        });
      });
    },
    pool
  };
};
