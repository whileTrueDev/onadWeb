// DB 커넥션 가져오기.
const pool = require('./connectionPool');
/* 2019-07-02 박찬우

*/
/**
 * @description
  Promise API를 이용한 비동기식 DB접근을 동기식화 하여 쿼리의 결과값을 리턴하는 함수,
  Error 또는 query 성공시 Logger로 입력을 진행한다.
  1. 사용법
    - query문 을 사용하는 js파일에 conn.query() 대신 사용.
    - .then() 과 .catch()를 이용하여 Error 핸들링 및 query data 사용.
  2. 필수사항
    - 쿼리 내부의 가변적 변수는 무.조.건 `?` 로 선언 이후, queryArray 로 넣는다.

 * @param {*} query 쿼리 string
 * @param {*} queryArray ? 에 해당하는 변수들을 요소로 가지는 array
 * @author 박찬우
 */
const doQuery = (query, queryArray = []) => new Promise((resolve, reject) => {
  pool.getConnection((err, conn) => {
    // 커넥션 시 에러발생
    if (err) {
      console.log('conn in err - getConnection 함수', conn);
      console.log(`DB연결 오류${err.message}`);
      reject({
        error: err,
      });
    } else {
      conn.query(query, queryArray, (error, result) => {
        if (error) {
          conn.release();
          reject({
            error: error.sqlMessage,
          });
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

const doTransacQuery = ({ connection, queryState, params }) => new Promise((resolve, reject) => {
  connection.beginTransaction((err) => {
    if (err) {
      console.log('doTransacQuery err');
      console.log(err);
      reject(err);
    }
    connection.query(queryState, params, (err1, result) => {
      if (err1) {
        console.log('doTransacQuery err1');
        console.log(err1);
        connection.rollback(() => {
          reject(err1);
        });
      } else {
        connection.commit((err2) => {
          if (err2) {
            console.log('doTransacQuery err2');
            console.log(err2);
            connection.rollback(() => {
              reject(err2);
            });
          } else {
            resolve();
          }
        });
      }
    });
  });
});

const doConnectionQuery = ({ connection, queryState, params }) => new Promise((resolve, reject) => {
  connection.query(queryState, params, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});


module.exports = {
  doQuery,
  doTransacQuery,
  doConnectionQuery
};
