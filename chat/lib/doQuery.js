const mysql = require('mysql');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  charset: process.env.DB_CHARSET
});

const doQuery = (query, queryArray = []) => new Promise((resolve, reject) => {
  pool.getConnection((err, conn) => {
    // 커넥션 시 에러발생
    if (err) {
      console.log('conn in err - getConnection 함수', conn);
      console.log(`DB연결 오류${err.message}`);
      reject(Error('in doQuery problem with DB connections'));
    } else {
      conn.query(query, queryArray, (error, result) => {
        if (error) {
          conn.release();
          reject(Error('in doQuery problem with DB queries'));
        } else {
          conn.release();
          resolve({
            error: null,
            result,
          });
        }
      });
    }
  });
});

module.exports = doQuery;
