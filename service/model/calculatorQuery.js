// DB 커넥션 가져오기.
const pool = require('./connectionPool');
const logger = require('../middlewares/calculation/calculatorLogger');


/* 2019-07-02 박찬우
0. 간략한 설명
  - Promise API를 이용한 비동기식 DB접근을 동기식화 하여 쿼리의 결과값을 리턴하는 함수.
  - 사용시에 resolve-reject와 then-catch를 사용한 Error 핸들링

1. 사용법
  - query문 을 사용하는 js파일에 conn.query() 대신 사용.
  - .then() 과 .catch()를 이용하여 Error 핸들링 및 query data 사용.
  - logger는 어떠한 함수에 Error 발생했는지 기록하여야하므로 calculation 에서 사용.
*/

const calculatorQuery = (query, queryArray = []) => new Promise((resolve, reject) => {
  pool.getConnection((err, conn) => {
    // 커넥션 시 에러발생
    if (err) {
      reject({
        cause: 'connection',
        error: err
      });
    } else {
      conn.query(query, queryArray, (error, result) => {
        if (error) {
          conn.release();
          reject({
            cause: 'query',
            error: error.sqlMessage
          });
        } else {
          conn.release();
          resolve({
            result
          });
        }
      });
    }
  });
});

module.exports = calculatorQuery;
