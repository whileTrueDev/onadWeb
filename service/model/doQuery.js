// DB 커넥션 가져오기.
const pool = require('./connectionPool');
const logger = require('../middlewares/logger');


/* 2019-07-02 박찬우
0. 간략한 설명
  - Promise API를 이용한 비동기식 DB접근을 동기식화 하여 쿼리의 결과값을 리턴하는 함수.
  - 사용시에 resolve-reject와 then-catch를 사용한 Error 핸들링
  - Error 또는 query 성공시 Logger로 입력.
1. 사용법
  - query문 을 사용하는 js파일에 conn.query() 대신 사용.
  - .then() 과 .catch()를 이용하여 Error 핸들링 및 query data 사용.  

*/

const doQuery = (query, queryArray=[]) => {
  return new Promise((resolve, reject)=>{
    pool.getConnection((err, conn)=>{
      // 커넥션 시 에러발생
      if(err){
        conn.release();
        logger.error('DB연결 관련 오류' + err);
        reject({
          error : err,
        }); 
      }
      conn.query(query, queryArray, (error, result)=>{
        if(error){
          conn.release();
          logger.error('query 관련 오류 : ' + error);
          reject({
            error : error.sqlMessage,
          }); 
        }else{
          conn.release();
          logger.info(query);
          resolve({
            error : null,
            result : result,
          });
        }
      })
    })
  })
}

module.exports = doQuery;